import { Properties, JsonData, TagProps } from './interface';
import { isObj, isFunc, isStr, isUndef, isArr } from '../utils';
import { SPACE, NEW_LINE, TAGS, PROPERTIES, DEFAULT_XML_DECLARATION, DEFAULT_HTML_DECLARATION } from '../constants';

export default function toXml(props: Partial<Properties>, jsonData: JsonData) {
  let xmlString = '';
  const aliasAttribute: string = props?.alias?.attribute || '_attr';
  const aliasContent: string = props?.alias?.content || '_val';

  const beautify = (char: string, repeat:number = 0): string => {
    if (!props.beautify) {
      return '';
    }
    let str: string = char;
    if (str === SPACE) {
      for (let i: number = 0; i < repeat; i += 1) {
        str += SPACE;
      }
      return repeat ? str : '';
    }
    return str;
  }

  const handleEntities = (str: string): string => {
    const regex = props.entityMap && RegExp(Object.keys(props.entityMap).join('|'), 'gi');
    return regex ? str.replace(regex, (match: string) => props?.entityMap?.[match] || ''): '';
  }

  const getContent = (content: any, quotes: boolean): string => {
    let str = isFunc(content) ? content() : content;
    if (isStr(str)) {
      str = handleEntities(str);
    }
    return quotes ? `"${str}"` : `${str}`;
  }

  const getAttributes = (attributes: JsonData): string => {
    let str = '';
    if (attributes) {
      Object.keys(attributes).forEach((a) => {
        str += ` ${a}=${getContent(attributes[a], true)}`;
      });
    }
    return str;
  }

  const hasChildTags = (data: any): boolean => {
    return (isObj(data)
      ? Object.keys(data).some((tagName) => ![aliasAttribute, aliasContent].includes(tagName))
      : false);
  }

  const hasContent = (data: any) : boolean => {
    let result: boolean;

    if (isObj(data)) {
      result = Object.keys(data).some((tagName) => ![aliasAttribute].includes(tagName));
    } else if (isFunc(data)) {
      result = data();
    } else {
      result = data;
    }
    return Boolean(result);
  }

  const parseToXml = (data: JsonData): string => {
    Object.keys(data).forEach((key) => {
      handleJSON(String(key), data[key], 0);
    });

    return xmlString;
  }

  const createTag = (name: string, type: string, tagProps: Partial<TagProps>) => {

    if (type === TAGS.OPENING) {
      xmlString += `${beautify(SPACE, tagProps.level)}<${name}${getAttributes(tagProps.attributes)}>`;
    } else if (type === TAGS.CLOSING) {
      xmlString += `${tagProps.childTags ? beautify(SPACE, tagProps.level) : ''}</${name}>${beautify(NEW_LINE)}`;
    } else if (type === TAGS.SELF_CLOSING) {
      xmlString += `${beautify(SPACE, tagProps.level)}<${name}${getAttributes(tagProps.attributes)}/>${beautify(NEW_LINE)}`;
    }

    if (!isUndef(tagProps.content)) {
      xmlString += `${getContent(tagProps.content, false)}`;
    }
  }
  
  const handleJSON = (key: string, data: any, level: number) => {

    if(isArr(data)) {
      return data.forEach((d: any) => {
        handleJSON(key, d, level);
      })
    }

    if ([aliasAttribute, aliasContent].includes(key)) {
      return;
    }

    const attributes = data?.data[aliasAttribute];
    if (props.selfClosing && hasContent(data)) {
      createTag(key, TAGS.SELF_CLOSING, {attributes, level});
      return;
    }

    createTag(key, TAGS.OPENING, {attributes, level});

    const childTags: boolean = hasChildTags(data);
    if(childTags) {
      xmlString += beautify(NEW_LINE);
      
      Object.keys(data).forEach((k) => {
        handleJSON(k, data[k], level + 1);
      });

    } else {
      const content: any = isObj(data) ? data[aliasContent] : data;
      createTag('', '', { content });
    }

    createTag(key, TAGS.CLOSING, { level, childTags });
  }
  
  return parseToXml(jsonData);
}