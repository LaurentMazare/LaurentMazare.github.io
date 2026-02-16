/* tslint:disable */
/* eslint-disable */

export class Model {
    free(): void;
    [Symbol.dispose](): void;
    add_voice(voice_weights: Uint8Array): number;
    generation_step(): Float32Array | undefined;
    constructor(model_weights: Uint8Array);
    /**
     * Prepare text for generation: capitalize, add punctuation, pad short text.
     * Returns [processed_text, frames_after_eos] as a JS array.
     */
    prepare_text(text: string): Array<any>;
    sample_rate(): number;
    start_generation(voice_index: number, token_ids: Uint32Array, frames_after_eos: number, temperature: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_model_free: (a: number, b: number) => void;
    readonly model_add_voice: (a: number, b: number, c: number) => [number, number, number];
    readonly model_generation_step: (a: number) => [number, number, number];
    readonly model_new: (a: number, b: number) => [number, number, number];
    readonly model_prepare_text: (a: number, b: number, c: number) => any;
    readonly model_sample_rate: (a: number) => number;
    readonly model_start_generation: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
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
