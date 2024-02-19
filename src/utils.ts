export const isObj = (val: any) => !!val && typeof val === 'object';

export const isFunc = (val: any) => typeof val === 'function';

export const isStr = (val: any) => typeof val === 'string';

export const isArr = (val: any) => Array.isArray(val);

export const isUndef = (val: any) => typeof val === 'undefined'