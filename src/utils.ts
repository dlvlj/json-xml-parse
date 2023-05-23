export const isObj = (val: object) => typeof val === 'object';

export const isFunc = (val: Function) => typeof val === 'function';

export const isStr = (val: string) => typeof val === 'string';

export const isArr = (val: any) => Array.isArray(val);

export const isUndef = (val: undefined) => typeof val === 'undefined'
