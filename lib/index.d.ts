export type Json = {
  parse: <A>(json: string, reviver?: ReviverFn) => A;
  stringify: <A>(value: A, replacer?: ReplacerFn, space?: string) => string;
}

export type ReviverFn = (key?: string, value?: unknown, pointer?: string) => unknown;
export type ReplacerFn = (key?: string, value?: unknown, pointer?: string) => unknown;

declare const Json: Json;
export const parse: Json["parse"];
export const stringify: Json["stringify"];

export default Json;
