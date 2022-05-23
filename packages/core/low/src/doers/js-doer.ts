import Module from 'module';

import { Doer } from './doer';
import { ConnectorContext } from '../connectors/connector';
import { TaskConfig } from '../environment';
import { Environment, IMap } from '..';
import { isObject } from '../utilities';

export class JSDoer<C, S> extends Doer<any, IMap<string>> {
  modules: IMap<JSModule> = {};
  moduleErrors: IMap<any> = {};

  async setup() {
    for (const [name, code] of Object.entries(this.config)) {
      const newModule = new JSModule(name, code as string);
      if (newModule.setup) await newModule.setup();
      this.modules[newModule.name] = newModule;
    }
  }

  hasModule = (name: string) => typeof this.modules[name] === 'function';

  getOrSetModule(name: string, code?: string) {
    if (this.hasModule(name)) return this.modules[name];
    if (code) {
      const newModule = new JSModule(name, code);
      this.modules[newModule.name] = newModule
      return this.modules[newModule.name];
    }
    throw new Error(`A module with the name '${name}' has not been registered`);
  }

  async main(context: ConnectorContext<any>, taskConfig: TaskConfig, config: JSTask): Promise<any> {
    try {
      const module = this.getOrSetModule(config.module, config.code);
      const method = module.getMethod(config.method);
      const output = await method(this.env, context, this.modules, config.parameters);
      return output;
    } catch (err) {
      this.moduleErrors[config.module || 'unknown'] = err;
      throw err;
    }
  }
}

export class JSModule {
  private _errors: IMap<Error> = {};
  private _path: string;
  private _code: string;
  private _name?: string;
  private _module?: Module;

  get path() { return this._path; }
  get code() { return this._code; }
  get exports() { return this.module.exports; }
  get main() {
    return (
      typeof this.module.exports === 'function' ?
      this.module.exports :
      typeof this.module.exports.main === 'function' ?
      this.module.exports.main :
      null
    );
  }

  get setup() {
    return (
      isObject(this.module.exports) && typeof this.module.exports.setup === 'function' ?
      this.module.exports.setup :
      null
    );
  }

  constructor(path: string, code: string) {
    this._path = path;
    this._code = code;
  }

  get module() {
    if (!this._module) {
      try {
        this._module = new Module('');
        this._module.paths = (require as any).main.paths;
        (this._module as any)._compile(this.code, this.path);
      } catch (err) {
        this._errors.module = err as Error;
        throw err;
      }
    }
    return this._module;
  }


  get name() {
    if (!this._name) {
      try {
        const found = this.code.match(/(?:\@module\s+)([\w]+)/);
        this._name = (
          found && found[1] ||
          this.path.split('/').slice(-1)[0].split('.')[0] ||
          this.path
        )
      } catch (err) {
        this._errors.name = err as Error;
        throw err;
      }
    }
    return this._name;
  }

  getMethod(name = 'main') {
    if (name === 'main' && this.main) return this.main;
    if (typeof this.exports[name] === 'function') return this.exports[name];
    throw Error(`No such method as '${name}' on module '${this.name}'`);
  }
}

export type JSModuleFunction = (env: Environment, context: ConnectorContext<any>, modules: IMap<JSModule>, parameters: any) => Promise<any>;

export interface JSTask {
  module: string;
  code?: string;
  parameters: IMap<any>;
  method?: string;
}