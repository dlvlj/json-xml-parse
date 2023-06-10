import { ToXmlProps, InputData, XmlTagProps } from './interface';
import { isObj, isFunc, isStr, isArr } from '../utils';
import { SPACE, NEW_LINE, TAGS, DEFAULTS} from '../constants';

export default function toXmlString(props: Partial<ToXmlProps>, jsonData: InputData): string {
  let xmlString: string = DEFAULTS.EMPTY_STR;
  const attrKey: string = props?.attrKey || DEFAULTS.ATTR_KEY;
  const contentKey: string = props?.contentKey || DEFAULTS.CONTENT_KEY;
  const entityMapRegex = props.entityMap && RegExp(Object.keys(props.entityMap).join('|'), 'gi');

  const beautify = (char: string, repeat: number = 0): string => {
    if (!props.beautify) {
      return DEFAULTS.EMPTY_STR;
    }
    let str: string = char;
    if (str === SPACE) {
      for (let i = 0; i < repeat; i += 1) {
        str += SPACE;
      }
      return repeat ? str : DEFAULTS.EMPTY_STR;
    }
    return str;
  }

  const handleEntities = (str: string): string => {
    return entityMapRegex ? str.replace(entityMapRegex, (match: string) => props.entityMap?.[match] || DEFAULTS.EMPTY_STR) : str;
  }

  const getStringVal = (inputData: any, doubleQuotes: boolean): string => {
    let strVal = isFunc(inputData) ? inputData() : inputData;
    if (isStr(strVal)) {
      strVal = handleEntities(strVal);
    }
    return doubleQuotes ? `"${strVal}"` : `${strVal}`;
  }

  const getAttributes = (attributes: InputData): string => {
    let str = DEFAULTS.EMPTY_STR;
    if (attributes) {
      Object.keys(attributes).forEach((a) => {
        str += ` ${a}=${getStringVal(attributes[a], true)}`;
      });
    }
    return str;
  }

  const isNestedData = (data: any): boolean => {
    return Boolean( !!data && isObj(data) && Object.keys(data).some((tagName) => ![attrKey, contentKey].includes(tagName)))
  }

  const hasValToShow = (data: any) : boolean => {
    if (!!data && isObj(data)) {
      return Object.keys(data).some((key) => ![attrKey].includes(key));
    } 
    return Boolean(data);
  }

  const createXmlTag = (
    name: string | null,
    type: string | null,
    XmlTagProps: Partial<XmlTagProps>
  ): void => {
    if(type && name) {
      if (type === TAGS.OPENING) {
        xmlString += `${beautify(SPACE, XmlTagProps.level)}<${name}${getAttributes(XmlTagProps.attributes)}>`;
      } else if (type === TAGS.SELF_CLOSING) {
        xmlString += `${beautify(SPACE, XmlTagProps.level)}<${name}${getAttributes(XmlTagProps.attributes)}/>${beautify(NEW_LINE)}`;
      } 
      // closing tag
      else {
        xmlString += `${XmlTagProps.childTags ? beautify(SPACE, XmlTagProps.level) : DEFAULTS.EMPTY_STR}</${name}>${beautify(NEW_LINE)}`;
      }
      return;
    }
    // to show content between tags <Tag>{content}</Tag>
    xmlString += `${getStringVal(XmlTagProps.content, false)}`;
  }
  
  const generateXmlString = (key: string, data: any, level: number) => {

    if(isArr(data)) {
      return data.forEach((d: any) => {
          generateXmlString(key, d, level);
      })
    }

    if ([attrKey, contentKey].includes(key)) {
      return;
    }

    const attributes = data?.[attrKey] || {};
    if (!hasValToShow(data) && props.selfClosing) {
      createXmlTag(key, TAGS.SELF_CLOSING, {attributes, level});
      return;
    }

    createXmlTag(key, TAGS.OPENING, {attributes, level});

    const childTags: boolean = isNestedData(data);
    if(childTags) {
      xmlString += beautify(NEW_LINE);
      Object.keys(data).forEach((k) => {
        generateXmlString(k, data[k], level + 1);
      });
    } else {
      const content: any = !!data && isObj(data) ? data[contentKey] : data;
      createXmlTag(null, null, { content });
    }
    createXmlTag(key, TAGS.CLOSING, { level, childTags });
  }

  const parseToXml = (data: InputData): string => {
    if(isArr(data)) {
      data.forEach((d: InputData, i: number) => {
        generateXmlString(String(i), d, 0);
      });
    } else {
      Object.keys(data).forEach((key) => {
        generateXmlString(key, data[key], 0);
      });
    }
    return xmlString;
  }
  
  return parseToXml(jsonData);
}