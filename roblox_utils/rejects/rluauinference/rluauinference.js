let runtime_promise = null;
let runtime_module = null;
const text_decoder = new TextDecoder();

async function load_runtime_factory() {
    const module = await import("./rluauinference_runtime.js");
    return module.default;
}

async function get_runtime_module() {
  if (!runtime_promise) {
    runtime_promise = (async () => {
      const create_runtime = await load_runtime_factory();
      runtime_module = await create_runtime();

      runtime_module._rli_init();
      return runtime_module;
    })();
  }

  return runtime_promise;
}

function encode_string(runtime, value) {
  const length = runtime.lengthBytesUTF8(value);
  const pointer = length === 0 ? 0 : runtime._malloc(length + 1);

  if (pointer) {
    runtime.stringToUTF8(value, pointer, length + 1);
  }

  return { pointer, length };
}

function encode_bytes(runtime, bytes) {
  if (!bytes || bytes.length === 0) {
    return { pointer: 0, length: 0 };
  }

  const pointer = runtime._malloc(bytes.length);
  runtime.HEAPU8.set(bytes, pointer);
  return { pointer, length: bytes.length };
}

function free_buffer(runtime, buffer) {
  if (buffer?.pointer) {
    runtime._free(buffer.pointer);
  }
}

function read_last_text(runtime) {
  const pointer = runtime._rli_last_text_ptr();
  const length = runtime._rli_last_text_len();
  if (!pointer || !length) {
    return "";
  }

  return text_decoder.decode(runtime.HEAPU8.slice(pointer, pointer + length));
}

function read_last_bytes(runtime) {
  const pointer = runtime._rli_last_bytes_ptr();
  const length = runtime._rli_last_bytes_len();
  if (!pointer || !length) {
    return new Uint8Array();
  }

  return runtime.HEAPU8.slice(pointer, pointer + length);
}

function throw_last_error(runtime, fallback_message) {
  const pointer = runtime._rli_last_error_ptr();
  const length = runtime._rli_last_error_len();
  if (pointer && length) {
    throw new Error(text_decoder.decode(runtime.HEAPU8.slice(pointer, pointer + length)));
  }

  throw new Error(fallback_message);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function now_ns() {
  return typeof performance !== "undefined" && performance.now
    ? performance.now() * 1e6
    : Date.now() * 1e6;
}

export class RobloxLightweightCmdSession {
  constructor(runtime, session_id) {
    this.runtime = runtime;
    this.session_id = session_id;
    this.operation_queue = Promise.resolve();
    this.output_listeners = new Set();
    this.run_listeners = new Set();
    this.pump_timer = null;
    this.pump_due_at = 0;
    this.pump_suppressed = false;
    this.is_pumping = false;
  }

  static async create(bytes, filename) {
    const runtime = await get_runtime_module();
    const wasm_bytes = encode_bytes(runtime, bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
    const wasm_filename = encode_string(runtime, filename);

    try {
      const session_id = runtime._rli_session_new(
        wasm_bytes.pointer,
        wasm_bytes.length,
        wasm_filename.pointer,
        wasm_filename.length
      );

      if (!session_id) {
        throw_last_error(runtime, "failed to start session");
      }

      return new RobloxLightweightCmdSession(runtime, session_id);
    } finally {
      free_buffer(runtime, wasm_bytes);
      free_buffer(runtime, wasm_filename);
    }
  }

  onOutput(listener) {
    this.output_listeners.add(listener);
    return () => {
      this.output_listeners.delete(listener);
    };
  }

  onRuns(listener) {
    this.run_listeners.add(listener);
    return () => {
      this.run_listeners.delete(listener);
    };
  }

  _enqueue(operation) {
    const next = this.operation_queue.then(operation, operation);
    this.operation_queue = next.catch(() => {});
    return next;
  }

  _read_eval_response() {
    const payload = read_last_text(this.runtime);
    return payload ? JSON.parse(payload) : { entries: [], next_delay_ms: null, http_requests: [], runs: [] };
  }

  _emit_entries(entries) {
    if (!Array.isArray(entries) || entries.length === 0) {
      return;
    }

    for (const listener of this.output_listeners) {
      listener(entries);
    }
  }

  _emit_runs(runs) {
    const normalized_runs = Array.isArray(runs) ? runs : [];
    for (const listener of this.run_listeners) {
      listener(normalized_runs);
    }
  }

  _schedule_pump(delay_ms) {
    if (!this.session_id || delay_ms == null || this.pump_suppressed) {
      return;
    }

    const target = performance.now() + Math.max(0, delay_ms);
    if (this.pump_timer && this.pump_due_at <= target) {
      return;
    }

    if (this.pump_timer) {
      clearTimeout(this.pump_timer);
    }

    this.pump_due_at = target;
    this.pump_timer = setTimeout(() => {
      this.pump_timer = null;
      this.pump_due_at = 0;
      this._pump_background().catch((error) => {
        this._emit_entries([{ kind: "error", message: error.message || String(error) }]);
      });
    }, Math.max(0, delay_ms));
  }

  async _pump_background() {
    if (!this.session_id || this.is_pumping || this.pump_suppressed) {
      return;
    }

    this.is_pumping = true;
    try {
      const response = await this._enqueue(() => {
        const ok = this.runtime._rli_session_continue(this.session_id);
        if (!ok) {
          throw_last_error(this.runtime, "failed to continue code");
        }

        const parsed = this._read_eval_response();
        return parsed;
      });

      this._emit_entries(response.entries);
      this._emit_runs(response.runs);
      await this._process_http_requests(response.http_requests);
      this._schedule_pump(response.next_delay_ms);
    } finally {
      this.is_pumping = false;
    }
  }

  async _process_http_requests(http_requests) {
    if (!Array.isArray(http_requests) || http_requests.length === 0 || !this.session_id) {
      return;
    }

    for (const request of http_requests) {
      await this._handle_http_request(request);
    }
  }

  async _handle_http_request(request) { // disabled, cors makes this basically useless to be a feature :/
    let success = true;
    let payload = "";

    try {
      const init = {
        method: request.method || "GET",
        headers: request.headers || {}
      };

      if (request.body != null) {
        init.body = request.body;
      }

      if (request.nocache) {
        init.cache = "no-store";
      }

      const response = await fetch(request.url, init);
      const body = await response.text();
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      payload = JSON.stringify({
        Success: response.ok,
        StatusCode: response.status,
        StatusMessage: response.statusText,
        Headers: headers,
        Body: body
      });
    } catch (error) {
      success = false;
      payload = error?.message || String(error);
    }

    const encoded = encode_string(this.runtime, payload);
    try {
      const response = await this._enqueue(() => {
        const ok = this.runtime._rli_session_http_response(
          this.session_id,
          BigInt(request.id),
          success ? 1 : 0,
          encoded.pointer,
          encoded.length
        );
        if (!ok) {
          throw_last_error(this.runtime, "failed to deliver HTTP response");
        }
        return this._read_eval_response();
      });

      this._emit_entries(response.entries);
      this._emit_runs(response.runs);
      await this._process_http_requests(response.http_requests);
      this._schedule_pump(response.next_delay_ms);
    } finally {
      free_buffer(this.runtime, encoded);
    }
  }

  async eval(code) {
    const wasm_code = encode_string(this.runtime, code);

    try {
      const response = await this._enqueue(() => {
        const ok = this.runtime._rli_session_eval(this.session_id, wasm_code.pointer, wasm_code.length);
        if (!ok) {
          throw_last_error(this.runtime, "failed to run code");
        }

        const parsed = this._read_eval_response();
        return parsed;
      });

      this._emit_runs(response.runs);
      const had_http = Array.isArray(response.http_requests) && response.http_requests.length > 0;
      await this._process_http_requests(response.http_requests);
      if (!had_http) {
        this._schedule_pump(response.next_delay_ms);
      }
      return response;
    } finally {
      free_buffer(this.runtime, wasm_code);
    }
  }

  async stopRun(run_id) {
    this.pump_suppressed = true;
    if (this.pump_timer) {
      clearTimeout(this.pump_timer);
      this.pump_timer = null;
      this.pump_due_at = 0;
    }

    let response = null;
    try {
      response = await this._enqueue(() => {
        const ok = this.runtime._rli_session_stop_run(this.session_id, run_id);
        if (!ok) {
          throw_last_error(this.runtime, "failed to stop script run");
        }

        return this._read_eval_response();
      });

      this._emit_entries(response.entries);
      this._emit_runs(response.runs);
      await this._process_http_requests(response.http_requests);
      return response;
    } finally {
      this.pump_suppressed = false;
      if (response?.next_delay_ms != null) {
        this._schedule_pump(response.next_delay_ms);
      }
    }
  }

  async output_name() {
    return this._enqueue(() => {
      const ok = this.runtime._rli_session_output_name(this.session_id);
      if (!ok) {
        throw_last_error(this.runtime, "failed to get output name");
      }

      return read_last_text(this.runtime);
    });
  }

  async save_current_place() {
    return this._enqueue(() => {
      const ok = this.runtime._rli_session_save_current_place(this.session_id);
      if (!ok) {
        throw_last_error(this.runtime, "failed to save current place");
      }

      return read_last_bytes(this.runtime);
    });
  }

  async free() {
    if (!this.session_id) {
      return;
    }

    if (this.pump_timer) {
      clearTimeout(this.pump_timer);
      this.pump_timer = null;
      this.pump_due_at = 0;
    }
    this.pump_suppressed = true;

    const session_id = this.session_id;
    this.session_id = 0;

    await this._enqueue(() => {
      const ok = this.runtime._rli_session_free(session_id);
      if (!ok) {
        throw_last_error(this.runtime, "failed to free session");
      }
    });

    this._emit_runs([]);
  }
}

export default async function init_wasm() {
  await get_runtime_module();
  return {
    RobloxLightweightCmdSession
  };
}
