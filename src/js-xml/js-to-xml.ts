import { InputProps, InputData } from './interface';
import { beautify, createEntityHandler, checkChildTags, createTag, setStringVal, setDeclaration } from './utils';
import { isObj, isArr, isFunc, keyExists } from '../utils';
import { TAGS, DEFAULTS} from '../constants';

export default (
  jsonData: InputData = {},
  props: Partial<InputProps> = {},
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

    if(isArr(data)) {
      data.forEach((d: any) => {
        generateXmlString(key, d, level);
      });
      return;
    }

    // type handling
    const [makeTag, tagData] = isFunc(props?.typeHandler)
      ?
        props?.typeHandler?.call(
          null,
          keyExists(data, contentKey) ? data[contentKey] : data
        )
      :
        [true, data];
    const attributes = tagData?.[attrKey] || {};
    const hasChidTags = checkChildTags(tagData, attrKey, contentKey);
    const content = keyExists(tagData, contentKey) ? tagData[contentKey] : tagData;

    // to avoid tag creation
    if (!makeTag || [attrKey, contentKey].includes(key)) {
      return;
    }

    // opening tag
    xmlString += key && createTag[TAGS.OPENING]({attributes, level, name: key, setEntities, beautify: props?.beautify}) || '';
    
    if(hasChidTags){
      xmlString += beautify(DEFAULTS.NEW_LINE, null, props?.beautify);

      // Generate child tags recursively
      if(isArr(content)) {
        content.forEach((d: InputData) => {
          generateXmlString(key, d, level + 1);
        });
      } else {
        Object.keys(content).forEach((k) => {
          generateXmlString(k, content[k], level + 1);
        }); 
      }
    } else {
      xmlString += setStringVal(content, false, setEntities);
    }

    // Closing tag
    xmlString += key && createTag[TAGS.CLOSING]({ level, hasChidTags: hasChidTags, name: key, setEntities, beautify: props?.beautify}) ||''
  }

  const parseToXML = (data: InputData): string => {
    if(isObj(data)) {
      Object.keys(data).forEach((key) => {
        generateXmlString(key, data[key], 0);
      });
    }
    return xmlString;
  }
  return parseToXML(jsonData);
}