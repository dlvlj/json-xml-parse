import { InputProps, InputData, TypeHandler } from './interface';
import { beautify, createEntityHandler, checkChildTags, createTag, setStringVal, setDeclaration } from './utils';
import { isObj, isArr } from '../utils';
import { TAGS, DEFAULTS} from '../constants';

export default (
  jsonData: InputData,
  props: Partial<InputProps>,
  typeHandler: TypeHandler = DEFAULTS.TYPE_HANDLER
): string => {
  const attrKey: string = props?.attrKey || DEFAULTS.ATTR_KEY;
  const contentKey: string = props?.contentKey || DEFAULTS.CONTENT_KEY;
  const setEntities = createEntityHandler(
    {
      ...DEFAULTS.ENTITY_MAP,
      ...(props?.entityMap || {})
    }
  );
  let xmlString: string = setDeclaration(props?.declaration, setEntities, props?.beautify);

  const generateXmlString = (key: string, data: any, level: number) => {
    // Handles an array of tags
    if(isArr(data)) {
      data.forEach((d: any) => {
        generateXmlString(key, d, level);
      });
      return;
    }

    const [tag, filteredData] = typeHandler(data);

    // to avoid tag creation
    if (!tag || [attrKey, contentKey].includes(key)) {
      return;
    }

    const attributes = filteredData?.[attrKey] || {};

    // // checks for missing tag content and self-closing option
    // if (!hasTagContent(data, attrKey) && props.selfClosing) {
    //   xmlString += createTag[TAGS.SELF_CLOSING]({attributes, level, name: key, setEntities, beautify: props?.beautify})
    //   return;
    // }

    // creates opening tag
    xmlString += key && createTag[TAGS.OPENING]({attributes, level, name: key, setEntities, beautify: props?.beautify}) || ''

    const hasChidTags: boolean = checkChildTags(filteredData, attrKey, contentKey);
    const content = !!filteredData && isObj(filteredData) ? filteredData[contentKey] : filteredData;
    const contentIsNested = Boolean(isObj(content) && Object.keys(content).length);

    if(hasChidTags){
      xmlString += beautify(DEFAULTS.NEW_LINE, null, props?.beautify);
      // Generate child tags recursively
      Object.keys(filteredData).forEach((k) => {
        generateXmlString(k, filteredData[k], level + 1);
      });
    } else {
      // Content value
      if(contentIsNested) {
        generateXmlString('', content, level);
      } else
      xmlString += setStringVal(content, false, setEntities);
    }
    // Closing tag
    xmlString += key && createTag[TAGS.CLOSING]({ level, hasChidTags: hasChidTags || contentIsNested, name: key, setEntities, beautify: props?.beautify}) ||''
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