import { InputProps, InputData } from './interface';
import { beautify, createEntityHandler, checkNestedTags, createTag, setStringVal, setDeclaration, cleanData } from './utils';
import { isObj, isArr, isFunc, keyIn } from '../utils';
import { TAGS, DEFAULTS} from '../constants';

export default (
  jsonData: InputData = DEFAULTS.EMPTY_OBJ,
  props: Partial<InputProps> = DEFAULTS.EMPTY_OBJ,
): string => {
  const attrKey: string = props?.attrKey || DEFAULTS.ATTR_KEY;
  const contentKey: string = props?.contentKey || DEFAULTS.CONTENT_KEY;
  const setEntities = createEntityHandler({...(isObj(props?.entityMap) ? props?.entityMap : DEFAULTS.ENTITY_MAP)});
  const global = {
    selfClosing: Boolean(keyIn(props, DEFAULTS.STR.selfClosing)? props.selfClosing : DEFAULTS.SELF_CLOSING.ENABLE)
  };
  const setTagData = (data: any) => {
    let rawData = keyIn(data, contentKey) ? data[contentKey] : data;
    rawData = isFunc(rawData) ? rawData() : rawData;
    // eslint-disable-next-line no-unsafe-optional-chaining
    const [makeTag, tagData] = isFunc(props.typeHandler) ? props?.typeHandler?.call(DEFAULTS.EMPTY_OBJ, rawData) : [DEFAULTS.MAKE_TAG, rawData];
    return [makeTag, cleanData(tagData, attrKey)];
  };

  let xmlString: string = setDeclaration(props?.declaration, setEntities, props?.beautify);

  const makeXmlStr = (key: string, data: any, level: number) => {
    const [makeTag, tagData] = setTagData(data);
    const attrObj = data?.[attrKey] || DEFAULTS.EMPTY_OBJ;
    const nestedTags = checkNestedTags(tagData, attrKey, contentKey);
    const selfClosing = global.selfClosing && !tagData;

    // Avoid tag creation
    if (!makeTag || [attrKey, contentKey].includes(key)) {
      return;
    }

    // Opening/selfClosing tag
    if(!isArr(tagData)) {
      xmlString += key && createTag[TAGS.OPENING]({attributes: attrObj, level, name: key, setEntities, beautify: props?.beautify, selfClosing}) || DEFAULTS.EMPTY_STR;
      
      if(selfClosing) {
        return;
      }
    }
    
    if(nestedTags){
      // Recursion for nested tags
      if(isArr(tagData)) {
        tagData.forEach((d: InputData) => {
          makeXmlStr(key, d, level);
        });
      } else {
        xmlString += beautify(DEFAULTS.NEW_LINE, DEFAULTS.LEVEL.INIT, props?.beautify);
        Object.keys(tagData).forEach((k) => {
          makeXmlStr(k, tagData[k], level + DEFAULTS.LEVEL.INCREMENT);
        }); 
      }
      // Nesting logic ends
    } else {
      // Adds tag data(any) in string
      xmlString += setStringVal(tagData, DEFAULTS.DOUBLE_QUOTES.DIASBLE, setEntities);
    }

    // Closing tag
    if(!isArr(tagData)) {
      xmlString += key && createTag[TAGS.CLOSING]({ level, nestedTags, name: key, setEntities, beautify: props?.beautify}) || DEFAULTS.EMPTY_STR
    }
  }

  if(isObj(jsonData)) {
    Object.keys(jsonData).forEach((key) => {
      makeXmlStr(key, jsonData[key], DEFAULTS.LEVEL.INIT);
    });
  }
  return xmlString;
}