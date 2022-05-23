/** @module Basic **/
const Jest = require('jest');

module.exports = {
  /** @type {import('../src').JSModuleFunction} **/
  async main(env, context, modules, parameters) {
    const test1 = Jest.getVersion();
    const [test2, second] = await modules.Other.getMethod()(env, context, modules, parameters);
    const test3 = /*html*/`<div id="${test1}"></div>`;

    return [test1, test2, test3, second];
  },

  /** @type {import('../src').JSModuleFunction} **/
  async second(env, context, modules, parameters) {
    return 'SECOND'
  }
}