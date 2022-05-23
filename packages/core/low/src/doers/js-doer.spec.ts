import { Environment } from '../environment';
import { ConnectorContext } from '../connectors/connector';
import { JSDoer } from '../doers/js-doer';
import { IMap } from '..';
import FS from 'fs';
import Path from 'path';

process.env.SECRETS = '{}';

test('should register module', async () => {
  const [doer, env] = await setupEnvironment();
  const context = createEmptyContext(env);

  const basicModule = doer.modules.Basic;
  const [test1, test2, test3, test4] = await basicModule.getMethod()(env, context, doer.modules, {}, {});

  expect(test1).toEqual('24.9.0');
  expect(test2).toEqual('24.9.0');
  expect(test3).toEqual('<div id="24.9.0"></div>');
  expect(test4).toEqual('SECOND');
});

function getTestModulesConfig () {
  const config: IMap<string> = {};
  const testModulesPath = Path.join(__dirname, '..', '..', 'js-doer-tests');
  const modules = FS.readdirSync(testModulesPath);
  for (const filename of modules) {
    const path = Path.join(testModulesPath, filename);
    const code = FS.readFileSync(path).toString();
    config[path] = code;
  }
  return config;
}

async function setupEnvironment(): Promise<[JSDoer<any, IMap<string>>, Environment]> {
  const doer = new JSDoer();
  const modules = { doers: [doer] };
  const config = { modules: { JSDoer: getTestModulesConfig() } };
  const env = new Environment(modules, [], config);
  await env.init();
  return [doer, env];
}

function createEmptyContext(env: Environment): ConnectorContext<any> {
  return {
    data: {},
    errors: {},
    calls: {},
    connector: {
      input: {},
      config: {}
    },
    env: env
  };
}