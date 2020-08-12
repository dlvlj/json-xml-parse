exports.jsToXml = function (json, options) {
  const jsonData = json;
  const INDENT = options ? Boolean(options.indent) : false;
  const ATTRIBUTES = options ? options.attribute : '';
  const VALUE = options ? options.value : '';
  const ENTITIES = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;"
  };
  const SPACE = " ";
  const NEW_LINE = "\n";
  let xmlString = "";

  // JSON TO XML LOGIC 
  xmlString = `<?xml version="1.0" encoding="UTF-8"?>${indentHelper(NEW_LINE)}`;

  for (tagName in jsonData) {
    createTag(tagName, jsonData[tagName], 0);
  }

  function createTag(tagName, tagData, level) {
    // THESE TAG NAMES ARE NOT CREATED
    if ([ATTRIBUTES, VALUE].includes(tagName)) {
      return;
    }

    const value = isObj(tagData) ? tagData[VALUE] : tagData; // VALUE OF TAG
    const attributes = tagData ? tagData[ATTRIBUTES] : null;
    const HAS_CHILDREN = hasChildren(tagData);
    const CAN_CREATE_CHILDREN_TAGS = canCreateChildrenTags(tagData);

    if (!HAS_CHILDREN) {
      addTag(tagName, "self-closing", {
        attributes, level
      });
      return;
    }

    addTag(tagName, "opening", { attributes, level });

    if (CAN_CREATE_CHILDREN_TAGS) {
      xmlString += indentHelper(NEW_LINE); // for  indent
      for (childTagName in tagData) {
        createTag(childTagName, tagData[childTagName], level + 1);
      }
    } else {
      addTag(null, null, { value }); // for adding value
    }

    addTag(tagName, "closing", { level, CAN_CREATE_CHILDREN_TAGS });
  }


  // UTILITY FUNCTIONS
  function addTag(tagName, tagType, options = {}) {
    const OPENING = "opening";
    const CLOSING = "closing";
    const SELF_CLOSING = "self-closing";
    const { value, attributes, level, CAN_CREATE_CHILDREN_TAGS } = options;
    //   for indent
    if (
      [OPENING, SELF_CLOSING].includes(tagType) ||
      ([CLOSING].includes(tagType) && CAN_CREATE_CHILDREN_TAGS)
    ) {
      xmlString += indentHelper(SPACE, level);
    }

    tagType === OPENING &&
      (xmlString += `<${tagName}${setAttributes(attributes)}>`);
    tagType === CLOSING && (xmlString += `</${tagName}>`);
    tagType === SELF_CLOSING &&
      (xmlString += `<${tagName}${setAttributes(attributes)}/>`);
    value && (xmlString = xmlString + `${setValue(value)}`);

    // for  indent
    if ([CLOSING, SELF_CLOSING].includes(tagType)) {
      xmlString += indentHelper(NEW_LINE);
    }
  }

  function hasChildren(tagData) {
    //CHILDREN CAN BE VALUE OR NESTED TAGS BUT NOT ATTRIBUTES
    return isObj(tagData)
      ? Object.keys(tagData).some((tag) => ![ATTRIBUTES].includes(tag))
      : tagData;
  }

  function canCreateChildrenTags(tagData) {
    //EXCLUDE VALUE AND ATTRIBUTES
    return isObj(tagData)
      ? Object.keys(tagData).some((tag) => ![ATTRIBUTES, VALUE].includes(tag))
      : false;
  }

  function setAttributes(attributes) {
    let attrString = "";
    attributes &&
      Object.keys(attributes).forEach((attribute) => {
        attrString += ` ${attribute}=${attrValue(attributes[attribute])}`;
      });
    return attrString;
  }

  function setValue(value) {
    let val = isFunc(value) ? value() : value;
    if (isStr(val)) {
      val = entityHelper(val)
    }
    return `${val}`;
  }
  function attrValue(attr) {
    let val = isFunc(attr) ? attr() : attr;
    if (isStr(val)) {
      val = entityHelper(val)
    }
    return `"${val}"`;
  }

  function entityHelper(str) {
    return str.replace(/<|>|&|"|'/gi, function (matched) {
      return ENTITIES[matched];
    });
  }

  function isObj(val) {
    return typeof val === "object" && !isFunc(val);
  }

  function isFunc(val) {
    return typeof val === "function";
  }

  function isStr(val) {
    return typeof val === "string";
  }

  function isArr(val) {
    return Array.isArray(val);
  }

  function indentHelper(char, level = 0) {
    if (!INDENT) {
      return '';
    }
    let str = char;

    if (str === SPACE) {
      for (let i = 0; i < level; i++) {
        str += SPACE;
      }
      return level ? str : "";
    }

    return str;
  }

  return xmlString;
}
