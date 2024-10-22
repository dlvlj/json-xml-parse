import { InputProps, InputData } from './interface';
import { beautify, createEntityHandler, checkChildTags, createTag, setStringVal, setDeclaration } from './utils';
import { isObj, isArr, isFunc, keyExists, objIsEmpty } from '../utils';
import { TAGS, DEFAULTS} from '../constants';

export default (
  jsonData: InputData = DEFAULTS.EMPTY_OBJ,
  props: Partial<InputProps> = DEFAULTS.EMPTY_OBJ,
): string => {
  const attrKey: string = props?.attrKey || DEFAULTS.ATTR_KEY;
  const contentKey: string = props?.contentKey || DEFAULTS.CONTENT_KEY;
  const setEntities = createEntityHandler(
    {
      ...(isObj(props?.entityMap) ? props?.entityMap : DEFAULTS.ENTITY_MAP)
    }
  );
  let xmlString: string = setDeclaration(props?.declaration, setEntities, props?.beautify);

  const generateXmlString = (key: string, data: any, level: number) => {
        
    const tagAttr = data?.[attrKey] || DEFAULTS.EMPTY_OBJ;
    let contentData = keyExists(data, contentKey) ? data[contentKey] : data;
    contentData = isFunc(contentData) ? contentData() : contentData;
    let [makeTag, tagContent] = isFunc(props?.typeHandler) ? props.typeHandler?.call(DEFAULTS.EMPTY_OBJ, contentData) : [DEFAULTS.MAKE_TAG, contentData];
    tagContent = objIsEmpty(tagContent) ? DEFAULTS.EMPTY_STR : tagContent //sets value as empty str for empty obj
    const hasChidTags = checkChildTags(tagContent, attrKey, contentKey);
    const selfClosing = (keyExists(props, 'selfClosing')? props.selfClosing : DEFAULTS.SELF_CLOSING.ENABLE) && [undefined, null, ''].includes(tagContent);

    // to avoid tag creation
    if (!makeTag || [attrKey, contentKey].includes(key)) {
      return;
    }

    // opening/selfClosing tag
    if(!isArr(tagContent)) {
      xmlString += key && createTag[TAGS.OPENING]({attributes: tagAttr, level, name: key, setEntities, beautify: props?.beautify, selfClosing}) || DEFAULTS.EMPTY_STR;
      if(selfClosing) {
        return;
      }
    }
    
    if(hasChidTags){
      // generate child tags recursively
      if(isArr(tagContent)) {
        tagContent.forEach((d: InputData) => {
          generateXmlString(key, d, level);
        });
      } else {
        xmlString += beautify(DEFAULTS.NEW_LINE, DEFAULTS.LEVEL.INIT, props?.beautify);
        Object.keys(tagContent).forEach((k) => {
          generateXmlString(k, tagContent[k], level + DEFAULTS.LEVEL.INCREMENT);
        }); 
      }
    } else {
      xmlString += setStringVal(tagContent, DEFAULTS.DOUBLE_QUOTES.DIASBLE, setEntities);
    }

    // closing tag
    if(!isArr(tagContent)) {
      xmlString += key && createTag[TAGS.CLOSING]({ level, hasChidTags: hasChidTags, name: key, setEntities, beautify: props?.beautify}) || DEFAULTS.EMPTY_STR
    }
  }

  const parseToXML = (data: InputData): string => {
    if(isObj(data)) {
      Object.keys(data).forEach((key) => {
        generateXmlString(key, data[key], DEFAULTS.LEVEL.INIT);
      });
    }
    return xmlString;
  }
  return parseToXML(jsonData);
}