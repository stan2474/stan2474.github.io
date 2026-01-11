/* tslint:disable */
/* eslint-disable */
export function start(): void;
export function convert_obj_to_filemesh(obj_data: Uint8Array, version: RobloxMeshVersion): Uint8Array;
export function convert_filemesh_to_obj(filemesh_data: Uint8Array): Uint8Array;
export function convert_filemesh_version(filemesh_data: Uint8Array, version: RobloxMeshVersion): Uint8Array;
export function is_binary_rbxl(bytes: Uint8Array): boolean;
export function fix_place(input_bytes: Uint8Array, _is_xml_output_hint_this_is_never_used_anymore_due_to_auto_detection: boolean, force_xml_output: boolean, force_binary_output: boolean, folders_to_models: boolean, mappings_js: any, convert_assetid_to_url: boolean, asset_url_format: string, convert_meshpart_to_specialmesh: boolean, smooth_to_voxel: boolean, smooth_terrain_format: TerrainFormat, downgrade_voxel: boolean, voxel_target_format: TerrainFormat, fix_unions: boolean): Uint8Array;
export enum RobloxMeshVersion {
  V1_00 = 0,
  V1_01 = 1,
  V2_00 = 2,
  V3_00 = 3,
  V4_00 = 4,
  V5_00 = 5,
}
export enum TerrainFormat {
  ClusterGridV1 = 0,
  ClusterGridV2 = 1,
  ClusterGridV3 = 2,
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly convert_obj_to_filemesh: (a: number, b: number, c: number) => [number, number, number, number];
  readonly convert_filemesh_to_obj: (a: number, b: number) => [number, number, number, number];
  readonly convert_filemesh_version: (a: number, b: number, c: number) => [number, number, number, number];
  readonly is_binary_rbxl: (a: number, b: number) => number;
  readonly fix_place: (a: number, b: number, c: number, d: number, e: number, f: number, g: any, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number) => [number, number, number, number];
  readonly start: () => void;
  readonly rust_zstd_wasm_shim_qsort: (a: number, b: number, c: number, d: number) => void;
  readonly rust_zstd_wasm_shim_malloc: (a: number) => number;
  readonly rust_zstd_wasm_shim_memcmp: (a: number, b: number, c: number) => number;
  readonly rust_zstd_wasm_shim_calloc: (a: number, b: number) => number;
  readonly rust_zstd_wasm_shim_free: (a: number) => void;
  readonly rust_zstd_wasm_shim_memcpy: (a: number, b: number, c: number) => number;
  readonly rust_zstd_wasm_shim_memmove: (a: number, b: number, c: number) => number;
  readonly rust_zstd_wasm_shim_memset: (a: number, b: number, c: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
