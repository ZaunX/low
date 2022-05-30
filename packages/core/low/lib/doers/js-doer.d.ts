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
    getModule: <T>(modules: any, moduleName: string) => T;
    executeDoer: <T>(env: Environment, doerName: string, context: ConnectorContext<any>, coreConfig: T, runAsTask?: boolean, metadata?: any) => Promise<any>;
}
export declare class JSModule {
    private _errors;
    private _path;
    private _code;
    private _name?;
    private _module?;
    get errors(): IMap<Error>;
    get path(): string;
    get code(): string;
    get exports(): any;
    get main(): any;
    get setup(): any;
    get hasErrors(): boolean;
    constructor(path: string, code: string);
    get module(): Module | undefined;
    get name(): string;
    getMethod(name?: string): any;
}
export declare type JSModuleFunction = (env: Environment, context: ConnectorContext<any>, modules: IMap<JSModule>, parameters: any, utilities: JSModuleUtilities) => Promise<any>;
export interface JSModuleUtilities {
    getModule: <T>(modules: any, moduleName: string) => JSModule;
    executeDoer: <T>(env: Environment, doerName: string, context: ConnectorContext<any>, coreConfig: T, runAsTask: boolean, metadata: any) => Promise<any>;
}
export interface JSTask {
    module: string;
    code?: string;
    parameters: IMap<any>;
    method?: string;
}
