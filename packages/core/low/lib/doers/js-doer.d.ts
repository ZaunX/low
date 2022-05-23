/// <reference types="node" />
import Module from 'module';
import { Doer } from './doer';
import { ConnectorContext } from '../connectors/connector';
import { TaskConfig } from '../environment';
import { Environment, IMap } from '..';
export declare class JSDoer<C, S> extends Doer<any, IMap<string>> {
    modules: IMap<JSModule>;
    moduleErrors: IMap<any>;
    setup(): Promise<void>;
    hasModule: (name: string) => boolean;
    getOrSetModule(name: string, code?: string): JSModule;
    main(context: ConnectorContext<any>, taskConfig: TaskConfig, config: JSTask): Promise<any>;
}
export declare class JSModule {
    private _errors;
    private _path;
    private _code;
    private _name?;
    private _module?;
    get path(): string;
    get code(): string;
    get exports(): any;
    get main(): any;
    get setup(): any;
    constructor(path: string, code: string);
    get module(): Module;
    get name(): string;
    getMethod(name?: string): any;
}
export declare type JSModuleFunction = (env: Environment, context: ConnectorContext<any>, modules: IMap<JSModule>, parameters: any) => Promise<any>;
export interface JSTask {
    module: string;
    code?: string;
    parameters: IMap<any>;
    method?: string;
}
