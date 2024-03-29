import { Module } from '../module';
import { ParserConfig, Parser } from '../parsers/parser';
import { Context } from '../environment';
import { CacheConfig, CacheManager, CacheKey } from '../cache-managers/cache-manager';

export class Renderer<T> extends Module {
  async render(config: RenderConfig<T>, context: Context): Promise<any> {
    let cacheManager: CacheManager | undefined;
    let cacheKey: CacheKey | undefined;

    if (config.__cacheConfig) {
      cacheManager = this.env.moduleManager.getModule<CacheManager>(config.__cacheConfig.cacheManager);
      cacheKey = await cacheManager.makeKey(config.__cacheConfig, context);
      const cachedItem = await cacheManager.getItem(cacheKey);
      if (cachedItem !== null) {
        return cachedItem;
      }
    }

    const template = await this.getTemplate(config, context);
    const rendered = await this.core(template, context, config.__metadata || {});
    const parsed = await this.parseRendered(rendered, config);

    if (cacheManager && cacheKey) {
      await cacheManager.setItem(cacheKey, parsed, (config.__cacheConfig as CacheConfig).ttl);
    }

    return parsed;
  }

  async getTemplate(config: RenderConfig<T>, context: Context): Promise<any> {
    return config.__template;
  }

  async parseRendered(rendered: any, config: RenderConfig<T>): Promise<any> {
    if (config.__parser) {
      const parser = this.env.moduleManager.getModule<Parser<any>>(config.__parser);
      const parsed = await parser.parse(rendered, config.__parserConfig || {});
      return parsed;
    } else {
      return rendered;
    }
  }

  async core(template: any, context: Context, metadata: any): Promise<any> {
    return template;
  }
}

export interface RenderConfig<T> {
  __renderer?: string;
  __template: T;
  __parser?: string;
  __parserConfig?: ParserConfig<any>;
  __metadata?: any;
  __cacheConfig?: CacheConfig;
  __spread?: true;
  __key?: RenderConfig<any>
}