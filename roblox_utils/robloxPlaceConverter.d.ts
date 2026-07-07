/* tslint:disable */
/* eslint-disable */

export enum LoadstringBytecodeHandlingMethod {
    None = 0,
    Fione = 1,
    UnluacDecompilation = 2,
}

export enum RobloxMeshVersion {
    V1_00 = 0,
    V1_01 = 1,
    V2_00 = 2,
    V3_00 = 3,
    V4_00 = 4,
    V5_00 = 5,
    V6_00 = 6,
    V7_00 = 7,
}

export enum TerrainFormat {
    ClusterGridV1 = 0,
    ClusterGridV2 = 1,
    ClusterGridV3 = 2,
}

export function convert_filemesh_to_obj(filemesh_data: Uint8Array): Promise<Uint8Array>;

export function convert_filemesh_version(filemesh_data: Uint8Array, version: RobloxMeshVersion): Promise<Uint8Array>;

export function convert_obj_to_filemesh(obj_data: Uint8Array, version: RobloxMeshVersion): Promise<Uint8Array>;

export function fix_place(input_bytes: Uint8Array, _is_xml_output_hint_this_is_never_used_anymore_due_to_auto_detection: boolean, force_xml_output: boolean, force_binary_output: boolean, folders_to_models: boolean, mappings_js: any, convert_assetid_to_url: boolean, asset_url_format: string, convert_meshpart_to_specialmesh: boolean, smooth_to_voxel: boolean, smooth_terrain_format: TerrainFormat, downgrade_voxel: boolean, voxel_target_format: TerrainFormat, fix_unions: boolean, remove_keyframesequences: boolean, loadstring_bytecode_handling_method: LoadstringBytecodeHandlingMethod): Uint8Array;

/**
 * Function exposed as `initThreadPool` to JS (see the main docs).
 *
 * Normally, you'd invoke this function from JS to initialize the thread pool.
 * However, if you strongly prefer, you can use [wasm-bindgen-futures](https://rustwasm.github.io/wasm-bindgen/reference/js-promises-and-rust-futures.html) to invoke and await this function from Rust.
 *
 * Note that doing so comes with extra initialization and Wasm size overhead for the JS<->Rust Promise integration.
 */
export function initThreadPool(num_threads: number): Promise<any>;

export function init_wasm_thread_pool(threads: number): Promise<any>;

export function is_binary_rbxl(bytes: Uint8Array): boolean;

export function minecraft_map_to_place(zip_bytes: Uint8Array, terrain_format: TerrainFormat): Uint8Array;

export function start(): void;

export class wbg_rayon_PoolBuilder {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    build(): void;
    mainJS(): string;
    numThreads(): number;
    receiver(): number;
}

export function wbg_rayon_start_worker(receiver: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly convert_filemesh_to_obj: (a: number, b: number) => any;
    readonly convert_filemesh_version: (a: number, b: number, c: number) => any;
    readonly convert_obj_to_filemesh: (a: number, b: number, c: number) => any;
    readonly fix_place: (a: number, b: number, c: number, d: number, e: number, f: number, g: any, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number) => [number, number, number, number];
    readonly is_binary_rbxl: (a: number, b: number) => number;
    readonly minecraft_map_to_place: (a: number, b: number, c: number) => [number, number, number, number];
    readonly start: () => void;
    readonly init_wasm_thread_pool: (a: number) => any;
    readonly __wbg_wbg_rayon_poolbuilder_free: (a: number, b: number) => void;
    readonly initThreadPool: (a: number) => any;
    readonly wbg_rayon_poolbuilder_build: (a: number) => void;
    readonly wbg_rayon_poolbuilder_mainJS: (a: number) => any;
    readonly wbg_rayon_poolbuilder_numThreads: (a: number) => number;
    readonly wbg_rayon_poolbuilder_receiver: (a: number) => number;
    readonly wbg_rayon_start_worker: (a: number) => void;
    readonly rust_zstd_wasm_shim_calloc: (a: number, b: number) => number;
    readonly rust_zstd_wasm_shim_free: (a: number) => void;
    readonly rust_zstd_wasm_shim_malloc: (a: number) => number;
    readonly rust_zstd_wasm_shim_memcmp: (a: number, b: number, c: number) => number;
    readonly rust_zstd_wasm_shim_memcpy: (a: number, b: number, c: number) => number;
    readonly rust_zstd_wasm_shim_memmove: (a: number, b: number, c: number) => number;
    readonly rust_zstd_wasm_shim_memset: (a: number, b: number, c: number) => number;
    readonly rust_zstd_wasm_shim_qsort: (a: number, b: number, c: number, d: number) => void;
    readonly wasm_bindgen_69b9755c9aabf95b___convert__closures_____invoke___wasm_bindgen_69b9755c9aabf95b___JsValue__core_b71b0a6f5a906bae___result__Result_____wasm_bindgen_69b9755c9aabf95b___JsError___true_: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen_69b9755c9aabf95b___convert__closures_____invoke___js_sys_ce4228677d4bba06___Function_fn_wasm_bindgen_69b9755c9aabf95b___JsValue_____wasm_bindgen_69b9755c9aabf95b___sys__Undefined___js_sys_ce4228677d4bba06___Function_fn_wasm_bindgen_69b9755c9aabf95b___JsValue_____wasm_bindgen_69b9755c9aabf95b___sys__Undefined_______true_: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen_69b9755c9aabf95b___convert__closures_____invoke___wasm_bindgen_69b9755c9aabf95b___JsValue______true_: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_69b9755c9aabf95b___convert__closures_____invoke___js_sys_ce4228677d4bba06___futures__task__wait_async_polyfill__MessageEvent______true_: (a: number, b: number, c: any) => void;
    readonly memory: WebAssembly.Memory;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_thread_destroy: (a?: number, b?: number, c?: number) => void;
    readonly __wbindgen_start: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput, memory?: WebAssembly.Memory, thread_stack_size?: number }} module - Passing `SyncInitInput` directly is deprecated.
 * @param {WebAssembly.Memory} memory - Deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput, memory?: WebAssembly.Memory, thread_stack_size?: number } | SyncInitInput, memory?: WebAssembly.Memory): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput>, memory?: WebAssembly.Memory, thread_stack_size?: number }} module_or_path - Passing `InitInput` directly is deprecated.
 * @param {WebAssembly.Memory} memory - Deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput>, memory?: WebAssembly.Memory, thread_stack_size?: number } | InitInput | Promise<InitInput>, memory?: WebAssembly.Memory): Promise<InitOutput>;
