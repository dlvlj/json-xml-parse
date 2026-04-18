import { InputData, DeclarationData, TagProps } from './interface';
import { DEFAULTS, TAGS } from "../constants";
import { isObj, isFunc, isStr, isArr, isEmptyObj, keyIn} from '../utils'

export const beautify = (char: string, level: number = DEFAULTS.LEVEL.INIT, enable = DEFAULTS.BEAUTIFY.ENABLE): string => {
  let str = char;

  if(!enable) {
    return DEFAULTS.EMPTY_STR;
  }

  if(char === DEFAULTS.SPACE) {
    str = DEFAULTS.EMPTY_STR;
    if(level) {
      for (let i = DEFAULTS.LEVEL.INIT; i < level; i += DEFAULTS.LEVEL.INCREMENT) {
        str += char;
      }
    }
    return str;
  }

  return str;
}

export const createEntityHandler = (entityMap: InputData) => {
  const entityMapRegex = entityMap && RegExp(Object.keys(entityMap).join('|'), 'gi');
  return (str: string) => 
    entityMapRegex ? 
    str.replace(entityMapRegex, (match: string) => entityMap?.[match] || DEFAULTS.EMPTY_STR)
    :
    str;
}

export const checkNestedTags = (data: InputData, attrKey: string, contentKey: string) => {
  if(isArr(data)) {
    return Boolean(data.length)
  } else if(isObj(data)) {
    const dataKeys = Object.keys(data);
    return Boolean(dataKeys.length && (dataKeys.find((k) => k === contentKey && isObj(data[k])) || dataKeys.find((k) => ![attrKey, contentKey].includes(k))) )
  }
  return false;
}

export const createTag = {
  [TAGS.OPENING]: (tagProps: Partial<TagProps>): string => `${beautify(DEFAULTS.SPACE, tagProps.level, tagProps.beautify)}<${tagProps.name}${setAttributes(tagProps.attributes, tagProps.setEntities)}${!tagProps.selfClosing? '>' : `/>${beautify(DEFAULTS.NEW_LINE, DEFAULTS.LEVEL.INIT, tagProps.beautify)}`}`,
  [TAGS.CLOSING]: (tagProps: Partial<TagProps>): string => `${tagProps.nestedTags ? beautify(DEFAULTS.SPACE, tagProps.level, tagProps.beautify) : DEFAULTS.EMPTY_STR}</${tagProps.name}>${beautify(DEFAULTS.NEW_LINE, DEFAULTS.LEVEL.INIT, tagProps.beautify)}`
}

export const setStringVal = (data: any, quotation: boolean, setEntities:((str: string) => string) | undefined): string => {
  let v = isFunc(data) ? data() : data;
  if (isStr(v) && setEntities) {
    v = setEntities(v);
  }
  return quotation ? `"${v}"` : `${v}`;
}

export const setAttributes = (attributes: InputData, setEntities:((str: string) => string) | undefined): string => {
  let str = DEFAULTS.EMPTY_STR;
  if (attributes) {
    Object.keys(attributes).forEach((a) => {
      str += ` ${a}=${setStringVal(attributes[a], DEFAULTS.DOUBLE_QUOTES.ENABLE, setEntities)}`;
    });
  }
  return str;
}

export const setDeclaration = (decAttrs: DeclarationData | void, setEntities: ((str: string) => string) | undefined, enableBeautify = DEFAULTS.BEAUTIFY.ENABLE): string => {
  const attrs = {
    ...(isObj(decAttrs)? decAttrs : DEFAULTS.DECLARATION)
  } 
  return `<?xml${setAttributes(attrs, setEntities)}?>${beautify(DEFAULTS.NEW_LINE, DEFAULTS.LEVEL.INIT, enableBeautify)}`
}

//sets value as empty str for (empty obj | falsy values | has only attr in obj)
export const cleanData = (data: any, lookupKey: string) => {
  return !data || isEmptyObj(data) || (Object?.keys(data)?.length === 1 && keyIn(data, lookupKey)) ? DEFAULTS.EMPTY_STR : data
}