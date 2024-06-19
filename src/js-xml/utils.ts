import { InputData, DeclarationData, TagProps } from './interface';
import { DEFAULTS, TAGS } from "../constants";
import { isObj, isFunc, isStr, isArr} from '../utils'

export const beautify = (char: string, level: number | null = 0, enable = false): string => {
  let str = char;

  if(!enable) {
    return DEFAULTS.EMPTY_STR;
  }

  if(char === DEFAULTS.SPACE) {
    str = DEFAULTS.EMPTY_STR;
    if(level) {
      for (let i = 0; i < level; i += 1) {
        str += char;
      }
    }
    return str;
  }
  return str;
}

export const createEntityHandler = (entityMap: InputData) => {
  const entityMapRegex = entityMap && RegExp(Object.keys(entityMap).join('|'), 'gi');
  return (str: string) => entityMapRegex ? str.replace(entityMapRegex, (match: string) => entityMap?.[match] || DEFAULTS.EMPTY_STR) : str;
}

export const checkChildTags = (data: InputData, attrKey: string, contentKey: string) => {
  const dataKeys = isObj(data) && !isArr(data)? Object.keys(data) : []
  return Boolean(dataKeys.length && (dataKeys.find((k) => k === contentKey && isObj(data[k])) || dataKeys.some((k) => ![attrKey, contentKey].includes(k))) )
  // return Boolean(isObj(data) && Object.keys(data).length && Object.keys(data).some((key) => ![attrKey, contentKey].includes(key)))
}

export const createTag = {
  [TAGS.OPENING]: (tagProps: Partial<TagProps>): string => `${beautify(DEFAULTS.SPACE, tagProps.level, tagProps.beautify)}<${tagProps.name}${setAttributes(tagProps.attributes, tagProps.setEntities)}>`,
  [TAGS.SELF_CLOSING]: (tagProps: Partial<TagProps>): string => `${beautify(DEFAULTS.SPACE, tagProps.level, tagProps.beautify)}<${tagProps.name}${setAttributes(tagProps.attributes, tagProps.setEntities)}/>${beautify(DEFAULTS.NEW_LINE, null, tagProps.beautify)}`,
  [TAGS.CLOSING]: (tagProps: Partial<TagProps>): string => `${tagProps.hasChidTags ? beautify(DEFAULTS.SPACE, tagProps.level, tagProps.beautify) : DEFAULTS.EMPTY_STR}</${tagProps.name}>${beautify(DEFAULTS.NEW_LINE, null, tagProps.beautify)}`
}

export const setStringVal = (inputData: any, quotationMarks: boolean, setEntities:((str: string) => string) | undefined): string => {
  let v = isFunc(inputData) ? inputData() : inputData;
  if (isStr(v)) {
    v = setEntities && setEntities(v);
  }
  return quotationMarks ? `"${v}"` : `${v}`;
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

export const setDeclaration = (decAttrs: DeclarationData | void, setEntities: ((str: string) => string) | undefined, beauti = false): string => {
  const attrs = {
    ...DEFAULTS.DECLARATION,
    ...(isObj(decAttrs)? decAttrs : {})
  } 
  return `<?xml${setAttributes(attrs, setEntities)}?>${beautify(DEFAULTS.NEW_LINE, null, beauti)}`
}