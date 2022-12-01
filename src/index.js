const { isObj, isFunc, isStr, isUndef } = require('../utils');
const { SPACE, NEW_LINE, TAGS, OPTIONS, INVALID_JSON_DATA, XML_START_STRING } = require('../utils/constants')

class Parser {
  constructor() {
    this.json = {};
    this.indent = false;
    this.attrProp = '';
    this.txtProp = '';
    this.xmlStr = '';
    this.entityRefs = {};
  }

  toXml(data, options) {
    if (!isObj(data)) {
      console.error(INVALID_JSON_DATA(data));
      return this.xmlStr;
    }

    this.json = data || {};

    if (options) {
      this.indent = Boolean(options[OPTIONS.indent]) || false;
      this.attrProp = String(options[OPTIONS.attrProp]) || '';
      this.txtProp = String(options[OPTIONS.txtProp]) || '';
      this.entityRefs = { ...options.entityRefs };
    }

    this.xmlStr = `${XML_START_STRING}${this.#addCharStr(NEW_LINE)}`;
    
    Object.keys(this.json).forEach( prop => {
      this.#handleJSON(prop, this.json[prop], 0);
    });

    return this.xmlStr;
  }

  #handleJSON(propName, data, lvl) {
    if ([this.attrProp, this.txtProp].includes(propName)) {
      return;
    }

    const text = isObj(data) ? data[this.txtProp] : data;
    const attrs = data ? data[this.attrProp] : null;
    const hasChildTags = this.#hasChildTags(data);

    if (!this.#hasData(data)) {
      this.#createTag(propName, TAGS.SELF_CLOSING, {
        attrs, lvl,
      });
      return;
    }

    this.#createTag(propName, TAGS.OPENING, { attrs, lvl });

    if (hasChildTags) {
      
      this.xmlStr += this.#addCharStr(NEW_LINE);
      
      Object.keys(data).forEach((childProp) => {
        this.#handleJSON(childProp, data[childProp], lvl + 1);
      });

    } else {

      this.#createTag(null, null, { text });

    }

    this.#createTag(propName, TAGS.CLOSING, { lvl, hasChildTags });
  }

  #hasChildTags(tagData) {
    return (isObj(tagData)
      ? Object.keys(tagData).some((tagName) => ![this.attrProp, this.txtProp].includes(tagName))
      : false);
  }

  #createTag(tagName, tagType, props = {}) {
    const {
      text, attrs, lvl, hasChildTags,
    } = props;

    if (tagType === TAGS.OPENING) {
      this.xmlStr += `${this.#addCharStr(SPACE, lvl)}<${tagName}${this.#getAttrs(attrs)}>`;
    } else if (tagType === TAGS.CLOSING) {
      this.xmlStr += `${hasChildTags? this.#addCharStr(SPACE, lvl) : ''}</${tagName}>${this.#addCharStr(NEW_LINE)}`;
    } else if (tagType === TAGS.SELF_CLOSING) {
      this.xmlStr += `${this.#addCharStr(SPACE, lvl)}<${tagName}${this.#getAttrs(attrs)}/>${this.#addCharStr(NEW_LINE)}`;
    }

    if (!isUndef(text)) {
      this.xmlStr += `${this.#getVal(text)}`;
    }
  }

  #hasData(tagData) {
    let result;

    if (isObj(tagData)) {
      result = Object.keys(tagData).some((tagName) => ![this.attrProp].includes(tagName));
    } else if (isFunc(tagData)) {
      result = tagData();
    } else {
      result = tagData;
    }
    return result;
  }

  #handleEntities(str) {
    const regex = RegExp(Object.keys(this.entityRefs).join('|'), 'gi');
    return str.replace(regex, (matched) => this.entityRefs[matched] || '');
  }

  #getVal(value, quotes = false) {
    let v = isFunc(value) ? value() : value;

    if (isStr(v)) {
      v = this.#handleEntities(v);
    }

    return quotes ? `"${v}"` : `${v}`;
  }

  #getAttrs(attrs) {
    let str = '';

    if (attrs) {
      Object.keys(attrs).forEach((attr) => {
        str += ` ${attr}=${this.#getVal(attrs[attr], true)}`;
      });
    }
    
    return str;
  }

  #addCharStr(char, lvl = 0) {
    if (!this.indent) {
      return '';
    }

    let str = char;

    if (str === SPACE) {
      for (let i = 0; i < lvl; i += 1) {
        str += SPACE;
      }
      return lvl ? str : '';
    }

    return str;
  }
}

module.exports = new Parser();
