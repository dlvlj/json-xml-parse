const INVALID_JSON_DATA = (v) => `required input type JSON. Got ${typeof v}.`

const XML_START_STRING = '<?xml version="1.0" encoding="UTF-8"?>';

const SPACE = ' ';

const NEW_LINE = '\n';

const TAGS = {
  OPENING: 'OPENING',
  CLOSING: 'CLOSING',
  SELF_CLOSING: 'SELF_CLOSING'
};

const OPTIONS = {
  attrProp: 'attrProp',
  txtProp: 'txtProp',
  indent: 'indent',
  entities: 'entities'
};

module.exports = {
  SPACE,
  NEW_LINE,
  TAGS,
  OPTIONS,
  INVALID_JSON_DATA,
  XML_START_STRING
}