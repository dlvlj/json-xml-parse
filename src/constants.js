const DEFAULT_XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
const DEFAULT_HTML_DECLARATION = '<!DOCTYPE html>';

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
  entityRefs: 'entityRefs',
  selfClosingTags: 'selfClosingTags'
};

module.exports = {
  SPACE,
  NEW_LINE,
  TAGS,
  OPTIONS,
  DEFAULT_XML_DECLARATION,
  DEFAULT_HTML_DECLARATION
}