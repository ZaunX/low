/** @module Other */
const JestConfig = require('jest/package.json');

/** @type {import('../src').JSModuleFunction} **/
module.exports = async function main(env, context, modules, parameters) {
  const test = JestConfig.version;
  const second = await modules.Basic.getMethod('second')();
  return [test, second];
};