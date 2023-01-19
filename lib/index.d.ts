export const parse: <A>(json: string, reviver?: ReviverFn) => A;
export const stringify: <A>(value: A, replacer?: ReplacerFn, space?: string) => string;

export type ReviverFn = (key: string, value: unknown, pointer: string) => unknown;
export type ReplacerFn = (key: string, value: unknown, pointer: string) => unknown;
