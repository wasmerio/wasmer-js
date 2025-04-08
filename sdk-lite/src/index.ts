import { srcAutobuildMutation } from '__generated__/srcAutobuildMutation.graphql';
import { createEnvironment } from './environment';
import RelayRuntime, { type Environment } from 'relay-runtime';
import { srcAutobuildSubscription } from '__generated__/srcAutobuildSubscription.graphql';
import { srcDeployAppData$data } from '__generated__/srcDeployAppData.graphql';
import { srcDeployAppVersionData$data } from '__generated__/srcDeployAppVersionData.graphql';
const { graphql, fetchQuery, commitMutation, requestSubscription } = RelayRuntime;

export type WasmerRegistryConfig = {
  registryUrl?: string;
  token?: string;
};

let config: {
  environment: Environment;
} | null = null;

const assertConfig = () => {
  if (!config) {
    throw new Error("Wasmer is not initialized. Please call init() first.");
  }
}

const environment = () => {
  assertConfig();
  return config!.environment;
}

class DeployApp {
  fragment = graphql`
    fragment srcDeployAppData on DeployApp {
      id
      willPerishAt
      name
      url
      adminUrl
      domains {
        edges {
          node {
            id
            url
          }
        }
      }
      favicon
      screenshot
      managed
    }
  `;
  id: string;
  willPerishAt: Date;
  name: string;
  url: string;
  adminUrl: string;
  domains: string[];
  favicon: string;
  screenshot: string;
  managed: boolean;
  constructor(data: srcDeployAppData$data) {
    this.id = data.id;
    this.willPerishAt = new Date(data.willPerishAt);
    this.name = data.name;
    this.url = data.url;
    this.adminUrl = data.adminUrl;
    this.domains = data.domains.edges.map((edge) => edge?.node?.url).filter((url) => url !== null) as string[];
    this.favicon = data.favicon;
    this.screenshot = data.screenshot;
    this.managed = data.managed;
  }
}

class DeployAppVersion {
  fragment = graphql`
    fragment srcDeployAppVersionData on DeployAppVersion {
      id
      app {
        ...srcDeployAppData
      }
    }
  `;
  id: string;
  app: DeployApp;
  constructor(data: srcDeployAppVersionData$data) {
    this.id = data.id;
    this.app = new DeployApp(data.app as any as srcDeployAppData$data);
  }
}
class AutobuildApp {
  buildId: string;
  appVersion: DeployAppVersion | null = null;
  subscription: any;
  pendingLogs: [string, string | undefined | null][] = [];
  onProgress: ((kind: string, message?: string | null) => void) | null = null;
  completedPromise: Promise<DeployAppVersion> | null = null;
  constructor(buildId: string) {
    this.buildId = buildId;
    this.completedPromise = new Promise((resolve, reject) => {
      this.subscription = requestSubscription<srcAutobuildSubscription>(environment(), {
        subscription: graphql`
          subscription srcAutobuildSubscription($buildId: UUID!) {
            autobuildDeployment(buildId: $buildId) {
              appVersion {
                ...srcDeployAppVersionData
              }
              kind
              message
            }
          }
        `,
      variables: {
        buildId: this.buildId,
      },
      onNext: (data) => {
        const { kind, message, appVersion } = data?.autobuildDeployment!;
        
        if (kind === "FAILED") {
          reject(message);
          return;
        }
        if (this.onProgress) {
          this.onProgress(kind, message);
        } else {
          this.pendingLogs.push([kind, message]);
        }
        if (appVersion) {
          const appVersionData = appVersion as any as srcDeployAppVersionData$data;
          this.appVersion = new DeployAppVersion(appVersionData);
          resolve(this.appVersion);
        }
      },
      onCompleted: () => {
        this.onProgress = null;
        this.subscription.dispose();
        if (!this.appVersion) {
          reject(new Error("The app could not be built"));
        }
        else {
          resolve(this.appVersion);
        }
      },
      onError: (error) => {
        console.error(error);
        reject(error);
      },
    });
  });
}
  subscribeToProgress(callback: (kind: string, message: string | null | undefined) => void) {
    if (this.pendingLogs.length > 0) {
      for (const [kind, message] of this.pendingLogs) {
        callback(kind, message);
      }
      this.pendingLogs = [];
    }
    this.onProgress = callback;
  }
  async finish() {
    await this.completedPromise;
  }
};

export const Wasmer = {
  autobuildApp: async (): Promise<AutobuildApp> => {
    const env = environment();
    let query: any = await (new Promise((resolve, reject) => {
      commitMutation<srcAutobuildMutation>(
        env,
        {mutation: graphql`
        mutation srcAutobuildMutation($input: DeployViaAutobuildInput!) {
          deployViaAutobuild(input: $input) {
            success
            buildId
          }
        }
      `,
      onCompleted: (response, errors) => {
        if (errors && errors.length > 0) {
          reject(`The app could not be built: ${errors[0].toString()}`);
          return;
        }
        resolve(response);
      },
      onError: (error) => {
        reject(`The app could not be built: ${error.toString()}`);
      },
      variables: {
        input: {
          region: "de-mons1", 
          appName: "xyz",
          repoUrl: "https://github.com/wasmerio/wordpress",
          // kind: "wordpress",
          // domains: ["xyz.static.studio"],
          // secrets: {
          // },
          // jobs: [{
          //   trigger: "postdeployment",
          //   command: "bash",
          //   cliArgs: "wp my-plugin activate ...; echo 'hello';"
          // }],
          params: {
            wordpress: {
              // phpVersion: "8.3",
              adminUsername: "myadmin",
              adminPassword: "mypassword",
              adminEmail: "my@email.com",
              siteName: "bcd",
              language: "es-ES",
              // Other things to preinstall
              // themes: ["twentytwentyfive"],
              // plugins: ["akismet", "myplugin"],
            }
          }
        }
      },
      })
    }));
    // console.log(query.deployViaAutobuild.buildId);
    const app = new AutobuildApp(query.deployViaAutobuild.buildId);
    return app;
  }
}
export const init = (settings: WasmerRegistryConfig) => {
  const environment = createEnvironment({endpoint: settings.registryUrl || "https://registry.wasmer.wtf/graphql", token: settings.token});
  config = {
    environment
  };
}
// const fetchFn: FetchFunction = function (request, variables) {
//   return new Observable.create(source => {
//     fetch('/my-graphql-api', {
//       method: 'POST',
//       body: JSON.stringify({
//         text: request.text,
//         variables,
//       }),
//     })
//       .then(response => response.json())
//       .then(data => source.next(data));
//   });
// };

// const network = Network.create(fetchFn);
// const store = new Store(new RecordSource());
// const environment = new Environment({
//   network,
//   store,
// });

init({
  registryUrl: "https://registry.wasmer.wtf/graphql",
  token: ""
});

const autobuildApp = await Wasmer.autobuildApp();
autobuildApp.subscribeToProgress((kind, message) => {
  console.log(kind, message);
});
const appId = await autobuildApp.finish();
console.log(appId);
