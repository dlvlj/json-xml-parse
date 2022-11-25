const { isObj, isFunc, isStr } = require('../utils');
const { SPACE, NEW_LINE, TAGS, OPTIONS, INVALID_JSON_DATA, XML_START_STRING } = require('../utils/constants')

class Parser {
  constructor() {
    this.json = {};
    this.indent = false;
    this.attrProp = '';
    this.txtProp = '';
    this.xmlStr = '';
    this.ENTITIES = {};
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
      this.ENTITIES = { ...options.entities };
    }

    this.xmlStr = `${XML_START_STRING}${this.#formatXml(NEW_LINE)}`;
    
    Object.keys(this.json).forEach((tagName) => {
      this.#handleJSON(tagName, this.json[tagName], 0);
    });

    return this.xmlStr;
  }

  #formatXml(char, lvl = 0) {
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

  #handleJSON(tagName, tagData, lvl) {
    if ([this.attrProp, this.txtProp].includes(tagName)) {
      return;
    }

    const text = isObj(tagData) ? tagData[this.txtProp] : tagData;
    const attrs = tagData ? tagData[this.attrProp] : null;
    const hasChildTags = this.#hasChildTags(tagData);

    if (!this.#hasData(tagData)) {
      this.#createTag(tagName, TAGS.SELF_CLOSING, {
        attrs, lvl,
      });
      return;
    }

    this.#createTag(tagName, TAGS.OPENING, { attrs, lvl });

    if (hasChildTags) {
      this.xmlStr += this.#formatXml(NEW_LINE);
      Object.keys(tagData).forEach((childTagName) => {
        this.#handleJSON(childTagName, tagData[childTagName], lvl + 1);
      });
    } else {
      this.#createTag(null, null, { text });
    }

    this.#createTag(tagName, TAGS.CLOSING, { lvl, hasChildTags });
  }

  #hasChildTags(tagData) {
    return (isObj(tagData)
      ? Object.keys(tagData).some((tagName) => ![this.attrProp, this.txtProp].includes(tagName))
      : false);
  }

  #createTag(name, type, op = {}) {
    const {
      text, attrs, lvl, hasChildTags,
    } = op;
    if (
      [TAGS.OPENING, TAGS.SELF_CLOSING].includes(type)
      || ([TAGS.CLOSING].includes(type) && hasChildTags)
    ) {
      this.xmlStr += this.#formatXml(SPACE, lvl);
    }

    if (type === TAGS.OPENING) {
      this.xmlStr += `<${name}${this.#getAttrs(attrs)}>`;
    }
    if (type === TAGS.CLOSING) {
      this.xmlStr += `</${name}>`;
    }
    if (type === TAGS.SELF_CLOSING) {
      this.xmlStr += `<${name}${this.#getAttrs(attrs)}/>`;
    }
    if (typeof text !== 'undefined') {
      this.xmlStr += `${this.#getVal(text)}`;
    }
    if ([TAGS.CLOSING, TAGS.SELF_CLOSING].includes(type)) {
      this.xmlStr += this.#formatXml(NEW_LINE);
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
    const regex = RegExp(Object.keys(this.ENTITIES).join('|'), 'gi');
    return str.replace(regex, (matched) => this.ENTITIES[matched] || '');
  }

  #getVal(value, quotes = false) {
    let val = isFunc(value) ? value() : value;
    if (isStr(val)) {
      val = this.#handleEntities(val);
    }
    return quotes ? `"${val}"` : `${val}`;
  }

  #getAttrs(attrs) {
    let attrStr = '';

    if (attrs) {
      Object.keys(attrs).forEach((attr) => {
        attrStr += ` ${attr}=${this.#getVal(attrs[attr], true)}`;
      });
    }
    
    return attrStr;
  }
}

module.exports = new Parser();
