const { isObj, isFunc, isStr } = require('../utils');
const { SPACE, NEW_LINE, TAGS, OPTIONS, INVALID_JSON_DATA } = require('../utils/constants')

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
    this.xmlStr = `<?xml version="1.0" encoding="UTF-8"?>${this.#indentXml(NEW_LINE)}`;
    Object.keys(this.json).forEach((tagName) => {
      this.#handleNode(tagName, this.json[tagName], 0);
    });
    return this.xmlStr;
  }

  #indentXml(char, lvl = 0) {
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

  #handleNode(tagName, tagData, lvl) {
    if ([this.attrProp, this.txtProp].includes(tagName)) {
      return;
    }

    const text = isObj(tagData) ? tagData[this.txtProp] : tagData;
    const attrs = tagData ? tagData[this.attrProp] : null;
    const hasChildrenTags = this.#hasChildrenTags(tagData);

    if (!this.#hasData(tagData)) {
      this.#createTag(tagName, TAGS.SELF_CLOSING, {
        attrs, lvl,
      });
      return;
    }

    this.#createTag(tagName, TAGS.OPENING, { attrs, lvl });

    if (hasChildrenTags) {
      this.xmlStr += this.#indentXml(NEW_LINE);
      Object.keys(tagData).forEach((childTagName) => {
        this.#handleNode(childTagName, tagData[childTagName], lvl + 1);
      });
    } else {
      this.#createTag(null, null, { text });
    }

    this.#createTag(tagName, TAGS.CLOSING, { lvl, hasChildrenTags });
  }

  #hasChildrenTags(tagData) {
    return (isObj(tagData)
      ? Object.keys(tagData).some((tagName) => ![this.attrProp, this.txtProp].includes(tagName))
      : false);
  }

  #createTag(name, type, op = {}) {
    const {
      text, attrs, lvl, hasChildrenTags,
    } = op;
    if (
      [TAGS.OPENING, TAGS.SELF_CLOSING].includes(type)
      || ([TAGS.CLOSING].includes(type) && hasChildrenTags)
    ) {
      this.xmlStr += this.#indentXml(SPACE, lvl);
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
      this.xmlStr += this.#indentXml(NEW_LINE);
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
    const reg = RegExp(Object.keys(this.ENTITIES).join('|'), 'gi');
    return str.replace(reg, (matched) => this.ENTITIES[matched] || '');
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
