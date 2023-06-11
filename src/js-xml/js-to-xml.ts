import { ToXmlProps, InputData } from './interface';
import { isObj, isArr, beautify, createEntityHandler, checkChildTags, CREATE_TAG, getStringVal, checkContent } from '../utils';
import { NEW_LINE, TAGS, DEFAULTS} from '../constants';

export default function toXmlString(props: Partial<ToXmlProps>, jsonData: InputData): string {
  let xmlString: string = DEFAULTS.EMPTY_STR;
  const attrKey: string = props?.attrKey || DEFAULTS.ATTR_KEY;
  const contentKey: string = props?.contentKey || DEFAULTS.CONTENT_KEY;
  const setEntities = createEntityHandler(props?.entityMap)

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
    if (!checkContent(data, attrKey) && props.selfClosing) {
      xmlString += CREATE_TAG[TAGS.SELF_CLOSING]({attributes, level, name: key, setEntities, beautify: props?.beautify})
      return;
    }
    xmlString += CREATE_TAG[TAGS.OPENING]({attributes, level, name: key, setEntities, beautify: props?.beautify})

    const hasChidTags: boolean = checkChildTags(data, attrKey, contentKey);

    if(hasChidTags) {
      xmlString += beautify(NEW_LINE, null, props?.beautify);
      Object.keys(data).forEach((k) => {
        generateXmlString(k, data[k], level + 1);
      });
    } else {
      const content: any = !!data && isObj(data) ? data[contentKey] : data;
      xmlString += `${getStringVal(content, false, setEntities)}`;
    }
    xmlString += CREATE_TAG[TAGS.CLOSING]({ level, hasChidTags, name: key, setEntities, beautify: props?.beautify})
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