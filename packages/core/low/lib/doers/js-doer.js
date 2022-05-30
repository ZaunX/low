"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = __importDefault(require("module"));
const doer_1 = require("./doer");
const utilities_1 = require("../utilities");
class JSDoer extends doer_1.Doer {
    constructor() {
        super(...arguments);
        this.modules = {};
        this.moduleErrors = {};
        this.hasModule = (name) => !!this.modules[name];
        this.getModule = (modules, moduleName) => {
            const module = modules[moduleName];
            if (!module)
                throw new Error(`No JSModule with the name '${moduleName}' has been loaded`);
            return module.exports;
        };
        this.executeDoer = (env, doerName, context, coreConfig, runAsTask = false, metadata = {}) => __awaiter(this, void 0, void 0, function* () {
            const doer = env.getDoer(doerName);
            const config = { name: `JSModule`, doer: doerName, config: coreConfig, metadata };
            if (runAsTask) {
                return yield doer.execute(context, config);
            }
            else {
                return yield doer.main(context, config, coreConfig);
            }
        });
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = [];
            for (const [name, code] of Object.entries(this.config)) {
                const newModule = new JSModule(name, code);
                if (newModule.setup)
                    yield newModule.setup();
                this.modules[newModule.name] = newModule;
                if (newModule.hasErrors)
                    errors.push(newModule);
            }
            if (errors.length > 0) {
                console.error(`The following ${errors.length} JSDoer modules have errors: ${errors.map(error => error.name).join(', ')}`);
            }
        });
    }
    getOrSetModule(name, code) {
        if (this.hasModule(name))
            return this.modules[name];
        if (code) {
            const newModule = new JSModule(name, code);
            this.modules[newModule.name] = newModule;
            return this.modules[newModule.name];
        }
        throw new Error(`A module with the name '${name}' has not been registered`);
    }
    main(context, taskConfig, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const module = this.getOrSetModule(config.module, config.code);
                const method = module.getMethod(config.method);
                const output = yield method(this.env, context, this.modules, config.parameters, {
                    getModule: this.getModule, executeDoer: this.executeDoer
                });
                return output;
            }
            catch (err) {
                this.moduleErrors[config.module || 'unknown'] = err;
                throw err;
            }
        });
    }
}
exports.JSDoer = JSDoer;
class JSModule {
    constructor(path, code) {
        this._errors = {};
        this._path = path;
        this._code = code;
    }
    get errors() { return this._errors; }
    get path() { return this._path; }
    get code() { return this._code; }
    get exports() {
        return (this.module ?
            this.module.exports :
            {});
    }
    get main() {
        return (!this.module ?
            null :
            typeof this.module.exports === 'function' ?
                this.module.exports :
                typeof this.module.exports.main === 'function' ?
                    this.module.exports.main :
                    null);
    }
    get setup() {
        return (!this.module ?
            null :
            utilities_1.isObject(this.module.exports) && typeof this.module.exports.setup === 'function' ?
                this.module.exports.setup :
                null);
    }
    get hasErrors() { return Object.keys(this._errors).length > 0; }
    get module() {
        if (!this._module) {
            try {
                this._module = new module_1.default('');
                this._module.paths = require.main.paths;
                this._module.path = this.path;
                this._module._compile(this.code, this.path);
            }
            catch (err) {
                this._errors.module = err;
            }
        }
        return this._module;
    }
    get name() {
        if (!this._name) {
            try {
                const found = this.code.match(/(?:\@module\s+)([\w]+)/);
                this._name = (found && found[1] ||
                    this.path.split('/').slice(-1)[0].split('.')[0] ||
                    this.path);
            }
            catch (err) {
                this._errors.name = err;
            }
        }
        return this._name || this.path;
    }
    getMethod(name = 'main') {
        if (name === 'main' && this.main)
            return this.main;
        if (typeof this.exports[name] === 'function')
            return this.exports[name];
        throw Error(`No such method as '${name}' on module '${this.name}'`);
    }
}
exports.JSModule = JSModule;
//# sourceMappingURL=js-doer.js.map