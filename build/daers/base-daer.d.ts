import { TaskConfig, TaskResponse } from '../interfaces';
import { BaseModule } from '../base-module';
import { Environment, Job } from '../environment';
export declare class BaseDaer extends BaseModule {
    constructor(env: Environment, name: string, ...args: any[]);
    execute(job: Job, taskConfig: TaskConfig, path: string[]): Promise<void>;
    getCoreConfig(job: Job, taskConfig: TaskConfig): Promise<void>;
    core(job: Job, taskConfig: TaskConfig, coreConfig: any): Promise<TaskResponse>;
    applySpecialProperties(property: any, job: Job): Promise<any>;
    applyBoringProperty(property: any, job: Job): Promise<any>;
    applyPointerProperty(property: any, job: Job): Promise<any>;
    applyRenderProperty(property: any, job: Job): Promise<any>;
    getPropertyType(property: any): PropertyType;
}
export declare enum PropertyType {
    BORING = 0,
    POINTER = 1,
    RENDERER = 2
}