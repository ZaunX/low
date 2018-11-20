"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_renderer_1 = require("./renderers/base-renderer");
const base_parser_1 = require("./parsers/base-parser");
const base_daer_1 = require("./daers/base-daer");
const base_cache_manager_1 = require("./cache-managers/base-cache-manager");
// Built-in Modules
// Daers
const basic_daer_1 = require("./daers/basic-daer");
// Parsers
const boolean_parser_1 = require("./parsers/boolean-parser");
const json_parser_1 = require("./parsers/json-parser");
const number_parser_1 = require("./parsers/number-parser");
const stringify_parser_1 = require("./parsers/stringify-parser");
const url_parser_1 = require("./parsers/url-parser");
// Renderers
const mustache_renderer_1 = require("./renderers/mustache-renderer");
// Cache Managers
const in_memory_cache_manager_1 = require("./cache-managers/in-memory-cache-manager");
/**
 * Class to encapsulate the entire working daer environment. It managers all task
 * configurations, modules, tests, etc.
 * @class
 */
class Environment {
    /**
     * @constructs Environment
     * @param {Map<TaskConfig>} - A Map of all task configurations that make up this Environment
     * @param {any} - An object containing metadata that might be needed by your system
     * @param {any} - An object containing configuration information for any registered modules
     */
    constructor(taskConfigs, metaData, moduleConfig) {
        this.taskConfigs = taskConfigs;
        this.metaData = metaData;
        this.moduleConfig = moduleConfig;
        /**
         * Holds the state of whether Profiling is on or off.
         * @member {boolean}
         */
        this.profiling = false;
        /**
         * A Map that stores all instances of registered Daer Modules
         * @member {BaseDaer}
         */
        this.daers = {};
        /**
         * A Map that stores all instances of registered Renderer Modules
         * @member {BaseRenderer}
         */
        this.renderers = {};
        /**
         * A Map that stores all instances of registered Parser Modules
         * @member {BaseParser}
         */
        this.parsers = {};
        /**
         * A Map that stores all instances of registered Cache Manager Modules
         * @member {BaseCacheManager}
         */
        this.cacheManagers = {};
        this.registerBuiltInModules();
    }
    /**
     * Register all built-in modules into this Environment. These modules will help you get started
     * @function registerBuiltInModules
     * @private
     */
    registerBuiltInModules() {
        // Register built-in Daers
        this.registerModule('basic', basic_daer_1.BasicDaer);
        // Register built-in Renderers
        this.registerModule('mustache', mustache_renderer_1.MustacheRenderer);
        // Register built-in Parsers
        this.registerModule('boolean', boolean_parser_1.BooleanParser);
        this.registerModule('json', json_parser_1.JsonParser);
        this.registerModule('number', number_parser_1.NumberParser);
        this.registerModule('stringify', stringify_parser_1.StringifyParser);
        this.registerModule('url', url_parser_1.UrlParser);
        // Register built-in Cache Managers
        this.registerModule('in-memory', in_memory_cache_manager_1.InMemoryCacheManager);
    }
    registerModule(name, moduleType, ...args) {
        let newModule = new moduleType(this, name, ...args);
        if (!newModule.moduleType) {
            const moduleType = newModule && newModule.constructor && newModule.constructor.name || '[unknown]';
            throw new Error(`Module type ${moduleType} does not inherit one of the proper base modules`);
        }
        const map = moduleType instanceof base_parser_1.BaseParser ? this.parsers :
            moduleType instanceof base_renderer_1.BaseRenderer ? this.renderers :
                moduleType instanceof base_daer_1.BaseDaer ? this.daers :
                    moduleType instanceof base_cache_manager_1.BaseCacheManager ? this.cacheManagers :
                        null;
        if (!map) {
            throw new Error(`Module type ${newModule.moduleType} is neither a Renderer, Parser, Task Module, or CacheManager`);
        }
        if (map.hasOwnProperty(name)) {
            throw new Error(`There already exists a ${newModule.moduleType} called "${name}"`);
        }
        map[name] = newModule;
        return newModule;
    }
}
exports.Environment = Environment;
//# sourceMappingURL=environment.js.map