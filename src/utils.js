const isObj = (val) => typeof val === 'object';

const isFunc = (val) => typeof val === 'function';

const isStr = (val) => typeof val === 'string';

const isArr = (val) => Array.isArray(val);

const isUndef = (val) => typeof val === 'undefined'

module.exports = {
  isObj,
  isFunc,
  isStr,
  isArr,
  isUndef
};
