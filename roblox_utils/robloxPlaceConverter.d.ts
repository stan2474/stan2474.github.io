/* tslint:disable */
/* eslint-disable */
export function start(): void;
export function convert_obj_to_filemesh(obj_data: Uint8Array, version: RobloxMeshVersion): Uint8Array;
export function convert_filemesh_to_obj(filemesh_data: Uint8Array): Uint8Array;
export function convert_filemesh_version(filemesh_data: Uint8Array, version: RobloxMeshVersion): Uint8Array;
export function is_binary_rbxl(bytes: Uint8Array): boolean;
export function fix_place(input_bytes: Uint8Array, _is_xml_output_hint_this_is_never_used_anymore_due_to_auto_detection: boolean, force_xml_output: boolean, force_binary_output: boolean, folders_to_models: boolean, mappings_js: any, convert_assetid_to_url: boolean, asset_url_format: string, convert_meshpart_to_specialmesh: boolean, smooth_to_voxel: boolean, smooth_terrain_format: TerrainFormat, downgrade_voxel: boolean, voxel_target_format: TerrainFormat): Uint8Array;
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
