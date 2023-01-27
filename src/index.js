import { isObj, isFunc, isStr, isUndef } from './utils.js';
import { SPACE, NEW_LINE, TAGS, OPTIONS, DEFAULT_XML_DECLARATION, DEFAULT_HTML_DECLARATION } from './constants.js';

class Parser {
  #json;
  #indent;
  #attrProp;
  #txtProp;
  #outputStr;
  #entityRefs;
  #selfClosingTags;

  constructor(options = {}) {
    this.#json = {};
    this.#outputStr = '';
    this.#indent = Boolean(options[OPTIONS.indent]) || false;
    this.#attrProp = String(options[OPTIONS.attrProp]) || '';
    this.#txtProp = String(options[OPTIONS.txtProp]) || '';
    this.#entityRefs = { ...options[OPTIONS.entityRefs] };
    this.#selfClosingTags = Boolean(options[OPTIONS.selfClosingTags]);
  }

  toXml(data = {}, xmlDeclaration = DEFAULT_XML_DECLARATION) {
    this.#json = data || {};
    this.#outputStr = `${xmlDeclaration}${this.#addIndentChar(NEW_LINE)}`;
    
    this.#handleConversion();
    return this.#outputStr;
  }

  toHTML(data = {}, htmlDeclaration = DEFAULT_HTML_DECLARATION) {
    this.#json = data || {};
    this.#outputStr = `${htmlDeclaration}${this.#addIndentChar(NEW_LINE)}`;

    this.#handleConversion();
    return this.#outputStr;
  }

  #handleConversion() {
    Object.keys(this.#json).forEach( prop => {
      this.#handleJSON(prop, this.#json[prop], 0);
    });
  }

  #handleJSON(propName, data, lvl) {
    if ([this.#attrProp, this.#txtProp].includes(propName)) {
      return;
    }

    const text = isObj(data) ? data[this.#txtProp] : data;
    const attrs = data ? data[this.#attrProp] : null;
    const hasChildTags = this.#hasChildTags(data);

    if (this.#selfClosingTags && !this.#hasData(data)) {
      this.#createTag(propName, TAGS.SELF_CLOSING, {attrs, lvl});
      return;
    }

    this.#createTag(propName, TAGS.OPENING, { attrs, lvl });

    if (hasChildTags) {
      
      this.#outputStr += this.#addIndentChar(NEW_LINE);
      
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
      ? Object.keys(tagData).some((tagName) => ![this.#attrProp, this.#txtProp].includes(tagName))
      : false);
  }

  #createTag(tagName, tagType, props) {

    if (tagType === TAGS.OPENING) {
      this.#outputStr += `${this.#addIndentChar(SPACE, props.lvl)}<${tagName}${this.#getAttrs(props.attrs)}>`;
    } else if (tagType === TAGS.CLOSING) {
      this.#outputStr += `${props.hasChildTags? this.#addIndentChar(SPACE, props.lvl) : ''}</${tagName}>${this.#addIndentChar(NEW_LINE)}`;
    } else if (tagType === TAGS.SELF_CLOSING) {
      this.#outputStr += `${this.#addIndentChar(SPACE, props.lvl)}<${tagName}${this.#getAttrs(props.attrs)}/>${this.#addIndentChar(NEW_LINE)}`;
    }

    if (!isUndef(props.text)) {
      this.#outputStr += `${this.#getVal(props.text)}`;
    }
  }

  #hasData(tagData) {
    let result;

    if (isObj(tagData)) {
      result = Object.keys(tagData).some((tagName) => ![this.#attrProp].includes(tagName));
    } else if (isFunc(tagData)) {
      result = tagData();
    } else {
      result = tagData;
    }
    return result;
  }

  #handleEntities(str) {
    const regex = RegExp(Object.keys(this.#entityRefs).join('|'), 'gi');
    return str.replace(regex, (matched) => this.#entityRefs[matched] || '');
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

  #addIndentChar(char, repeat = 0) {
    if (!this.#indent) {
      return '';
    }

    let str = char;

    if (str === SPACE) {
      for (let i = 0; i < repeat; i += 1) {
        str += SPACE;
      }
      return repeat ? str : '';
    }

    return str;
  }
}

module.exports = Parser;
