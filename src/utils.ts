import { InputData, TagProps } from './js-xml/interface';
import { DEFAULTS, TAGS } from "./constants";

export const isObj = (val: any) => typeof val === 'object';

export const isFunc = (val: any) => typeof val === 'function';

export const isStr = (val: any) => typeof val === 'string';

export const isArr = (val: any) => Array.isArray(val);

export const isUndef = (val: any) => typeof val === 'undefined'

export const beautify = (char: string, level: number | null = 0, enable = false): string => {
  if(!enable) {
    return DEFAULTS.EMPTY_STR;
  }

  let str: string =  char;

  if (level) {
    for (let i = 0; i < level; i += 1) {
      str += char;
    }
  }
  return str;
}

export const createEntityHandler = (entityMap: InputData) => {
  const entityMapRegex = entityMap && RegExp(Object.keys(entityMap).join('|'), 'gi');
  return (str: string) => entityMapRegex ? str.replace(entityMapRegex, (match: string) => entityMap?.[match] || DEFAULTS.EMPTY_STR) : str;
}

export const checkChildTags = (data: InputData, attrKey: string, contentKey: string) => {
  return Boolean( !!data && isObj(data) && Object.keys(data).some((tagName) => ![attrKey, contentKey].includes(tagName)))
}

export const createTag = {
  [TAGS.OPENING]: (tagProps: Partial<TagProps>): string => `${beautify(DEFAULTS.SPACE, tagProps.level, tagProps.beautify)}<${tagProps.name}${setAttributes(tagProps.attributes, tagProps.setEntities)}>`,
  [TAGS.SELF_CLOSING]: (tagProps: Partial<TagProps>): string => `${beautify(DEFAULTS.SPACE, tagProps.level, tagProps.beautify)}<${tagProps.name}${setAttributes(tagProps.attributes, tagProps.setEntities)}/>${beautify(DEFAULTS.NEW_LINE, null, tagProps.beautify)}`,
  [TAGS.CLOSING]: (tagProps: Partial<TagProps>): string => `${tagProps.hasChidTags ? beautify(DEFAULTS.SPACE, tagProps.level, tagProps.beautify) : DEFAULTS.EMPTY_STR}</${tagProps.name}>${beautify(DEFAULTS.NEW_LINE, null, tagProps.beautify)}`
}

export const setStringVal = (inputData: any, doubleQuotes: boolean, setEntities:((str: string) => string) | undefined): string => {
  let strVal = isFunc(inputData) ? inputData() : inputData;
  if (isStr(strVal)) {
    strVal = setEntities && setEntities(strVal);
  }
  return doubleQuotes ? `"${strVal}"` : `${strVal}`;
}

export const setAttributes = (attributes: InputData, setEntities:((str: string) => string) | undefined): string => {
  let str = DEFAULTS.EMPTY_STR;
  if (attributes) {
    Object.keys(attributes).forEach((a) => {
      str += ` ${a}=${setStringVal(attributes[a], true, setEntities)}`;
    });
  }
  return str;
}

export const checkContent = (data: InputData, attrKey: string) => {
  if (!!data && isObj(data)) {
    return Object.keys(data).some((key) => ![attrKey].includes(key));
  } 
  return Boolean(data);
}

export const setDeclaration = (decAttrs: InputData | void, setEntities: ((str: string) => string) | undefined, beauti = false): string => {
  const attrs = {
    ...DEFAULTS.DECLARATION,
    ...(isObj(decAttrs)? decAttrs : {})
  } 
  return `<?xml${setAttributes(attrs, setEntities)}?>${beautify(DEFAULTS.NEW_LINE, null, beauti)}`
}