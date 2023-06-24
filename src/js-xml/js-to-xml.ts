import { InputProps, InputData } from './interface';
import { isObj, isArr, beautify, createEntityHandler, checkChildTags, createTag, setStringVal, checkContent, setDeclaration } from '../utils';
import { TAGS, DEFAULTS} from '../constants';

export default (props: Partial<InputProps>, jsonData: InputData): string => {
  const attrKey: string = props?.attrKey || DEFAULTS.ATTR_KEY;
  const contentKey: string = props?.contentKey || DEFAULTS.CONTENT_KEY;
  const setEntities = createEntityHandler(props?.entityMap);
  let xmlString: string = setDeclaration(props?.declaration, setEntities, props?.beautify);

  const generateXmlString = (key: string, data: any, level: number) => {
    // Handles an array of same tag, e.g., h1: ['title1', 'title2', 'title3']
    if(isArr(data)) {
      data.forEach((d: any) => {
        generateXmlString(key, d, level);
      });
      return;
    }

    if ([attrKey, contentKey].includes(key)) {
      return;
    }

    const attributes = data?.[attrKey] || {};

    // If the content is missing and self-closing tags are enabled
    if (!checkContent(data, attrKey) && props.selfClosing) {
      xmlString += createTag[TAGS.SELF_CLOSING]({attributes, level, name: key, setEntities, beautify: props?.beautify})
      return;
    }

    // Opening tag
    xmlString += createTag[TAGS.OPENING]({attributes, level, name: key, setEntities, beautify: props?.beautify})

    const hasChidTags: boolean = checkChildTags(data, attrKey, contentKey);

    if(hasChidTags) {
      xmlString += beautify(DEFAULTS.NEW_LINE, null, props?.beautify);
       // Generate child tags recursively
      Object.keys(data).forEach((k) => {
        generateXmlString(k, data[k], level + 1);
      });
    } else {
      const content: any = !!data && isObj(data) ? data[contentKey] : data;
      // Content value
      xmlString += setStringVal(content, false, setEntities);
    }
    // Closing tag
    xmlString += createTag[TAGS.CLOSING]({ level, hasChidTags, name: key, setEntities, beautify: props?.beautify})
  }

  const parseToXml = (data: InputData): string => {
    // If the input data is JSON Array
    if(isArr(data)) 
      data.forEach((d: InputData, i: number) => {
        generateXmlString(String(i), d, 0);
      });
    // If the input data is JSON Object
    else 
      Object.keys(data).forEach((key) => {
        generateXmlString(key, data[key], 0);
      });
    return xmlString;
  }

  return parseToXml(jsonData);
}