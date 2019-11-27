import { Module } from '../module';
import { ParserConfig } from '../parsers/parser';
import { Context } from '../environment';
import { CacheConfig, CacheManager, CacheKey } from '../cache-managers/cache-manager';

export class Renderer<C, S> extends Module<C, S> {
  async render(config: RenderConfig, context: Context): Promise<any> {
    let cacheManager: CacheManager<any, any> | undefined;
    let cacheKey: CacheKey | undefined;

    if (config.__cacheConfig) {
      cacheManager = this.env.getCacheManager(config.__cacheConfig.cacheManager);
      cacheKey = await cacheManager.makeKey(config.__cacheConfig, context);
      const cachedItem = await cacheManager.getItem(cacheKey);
      if (cachedItem !== null) {
        return cachedItem;
      }
    }

    const template = await this.getTemplate(config, context);
    const rendered = await this.core(template, context);
    const parsed = await this.parseRendered(rendered, config);

    if (cacheManager && cacheKey) {
      await cacheManager.setItem(cacheKey, parsed, (config.__cacheConfig as CacheConfig).ttl);
    }

    return parsed;
  }

  async getTemplate(config: RenderConfig, context: Context): Promise<any> {
    return config.__template;
  }

  async parseRendered(rendered: any, config: RenderConfig): Promise<any> {
    if (config.__parser) {
      const parser = this.env.getParser(config.__parser);
      const parsed = await parser.parse(rendered, config.__parserConfig || {});
      return parsed;
    } else {
      return rendered;
    }
  }

  async core(template: any, context: Context): Promise<any> {
    return template;
  }
}

export interface RenderConfig {
  __renderer: string;
  __template: any;
  __parser?: string;
  __parserConfig?: ParserConfig<any>;
  __metaData?: any;
  __cacheConfig?: CacheConfig;
}