export const TAGS = {
  OPENING: 'OPENING',
  CLOSING: 'CLOSING',
  SELF_CLOSING: 'SELF_CLOSING'
};
export const DEFAULTS = {
  SPACE: '\t',
  NEW_LINE: '\n',
  ATTR_KEY: '@',
  CONTENT_KEY: '#',
  EMPTY_STR: '',
  DECLARATION: {
    version: '1.0'
  },
  ENTITY_MAP: {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;"
  },
  TYPE_HANDLER: (val: any): [boolean, any] => [true, val],
  LEVEL: {
    INIT: 0,
    INCREMENT: 1
  },
  DOUBLE_QUOTES: {
    ENABLE: true,
    DIASBLE: false
  },
  MAKE_TAG: true,
  BEAUTIFY: {
    ENABLE: true,
    DISABLE: false
  },
  SELF_CLOSING: {
    ENABLE: true,
    DISABLE: false
  },
  get EMPTY_OBJ() {
    return new Object();
  },
  get EMPTY_ARR() {
    return new Array();
  }
}