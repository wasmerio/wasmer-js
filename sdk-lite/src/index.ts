import { srcAutobuildMutation, srcAutobuildMutation$variables } from '__generated__/srcAutobuildMutation.graphql';
import { createEnvironment } from './environment';
import RelayRuntime, { ReaderFragment, type Environment } from 'relay-runtime';
import { srcAutobuildSubscription } from '__generated__/srcAutobuildSubscription.graphql';
import nodeApp, { srcDeployAppData$data } from '__generated__/srcDeployAppData.graphql';
import nodeAppVersion, { srcDeployAppVersionData$data, srcDeployAppVersionData$key } from '__generated__/srcDeployAppVersionData.graphql';
import nodeDeployAppKindWordPress, { srcDeployAppKindWordPress$data, srcDeployAppKindWordPress$key } from '__generated__/srcDeployAppKindWordPress.graphql';
const { graphql, fetchQuery, commitMutation, requestSubscription, getSelector } = RelayRuntime;

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

class DeployAppKind {
  static fragment = graphql`
    fragment srcDeployAppKind on Kind {
      ...on WordpressAppKind {
        __typename
      }
    }
  `
}

class DeployAppKindWordPress extends DeployAppKind {
  static fragment = graphql`
    fragment srcDeployAppKindWordPress on Kind {
      ...on WordpressAppKind {
        adminUrl
      }
    }
  `
  adminUrl?: string;
  constructor(data: srcDeployAppKindWordPress$data) {
    super();
    this.adminUrl = data.adminUrl;
  }
}

class DeployApp {
      
  static fragment = graphql`
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
      # managed
      # kind {
      #   __typename
      #   ...srcDeployAppKind
      # }
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
  // managed: boolean;
  // kind: DeployAppKind | null = null;
  constructor(data: srcDeployAppData$data) {
    this.id = data.id;
    this.willPerishAt = new Date(data.willPerishAt);
    this.name = data.name;
    this.url = data.url;
    this.adminUrl = data.adminUrl;
    this.domains = data.domains.edges.map((edge) => edge?.node?.url).filter((url) => url !== null) as string[];
    this.favicon = data.favicon;
    this.screenshot = data.screenshot;
    // this.managed = data.managed;
    // if (data.kind?.__typename === "WordPressAppKind") {
    //   let kindData = getFragmentData<srcDeployAppKindWordPress$data>(environment(), nodeApp, data.kind);
    //   this.kind = new DeployAppKindWordPress(kindData);
    // }
  }
}

class DeployAppVersion {
  static fragment = graphql`
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
    let appData = getFragmentData<srcDeployAppData$data>(environment(), nodeApp, data.app);
    this.app = new DeployApp(appData);
  }
}
function getFragmentData<T>(environment: Environment, node: ReaderFragment, fetchedData: any): T {
  let selector = getSelector(node, fetchedData);
  return environment.lookup(selector as any).data as any;
}

export type AutoBuildProgressData = {
  kind: string;
  message: string | undefined | null;
  datetime: string;
  stream: string | undefined | null;
}

class AutobuildApp {
  buildId: string;
  appVersion: DeployAppVersion | null = null;
  subscription: any;
  pendingLogs: AutoBuildProgressData[] = [];
  onProgress: ((data: AutoBuildProgressData) => void) | null = null;
  completedPromise: Promise<DeployAppVersion> | null = null;
  constructor(buildId: string) {
    this.buildId = buildId;
    this.completedPromise = new Promise((resolve, reject) => {
      const env = environment();
      this.subscription = requestSubscription<srcAutobuildSubscription>(env, {
        subscription: graphql`
          subscription srcAutobuildSubscription($buildId: UUID!) {
            autobuildDeployment(buildId: $buildId) {
              appVersion {
                ...srcDeployAppVersionData
              }
              kind
              datetime
              stream
              message
            }
          }
        `,
      variables: {
        buildId: this.buildId,
      },
      onNext: (data) => {
        // console.log(data);
        if (!data?.autobuildDeployment) {
          return;
        }
        const { kind, message, appVersion, datetime, stream } = data?.autobuildDeployment!;
        
        if (kind === "FAILED") {
          reject(message);
          return;
        }
        else if (kind === "COMPLETE") {
          if (appVersion !== undefined) {
            let appVersionData = getFragmentData<srcDeployAppVersionData$data>(env, nodeAppVersion, appVersion);
            this.appVersion = new DeployAppVersion(appVersionData);
            resolve(this.appVersion);
            return;
          }
          else {
            reject(new Error("Error when building the app: build finished without deployed app"));
            return;
          }
        }
        if (this.onProgress) {
          this.onProgress({kind, message, datetime, stream});
        } else {
          this.pendingLogs.push({kind, message, datetime, stream});
        }
      },
      onCompleted: () => {
        this.onProgress = null;
        this.subscription.dispose();
        if (!this.appVersion) {
          reject(new Error("Error when building the app: build finished without deployed app"));
        }
        else {
          resolve(this.appVersion);
          return;
        }
      },
      onError: (error) => {
        console.error(error);
        reject(error);
      },
    });
  });
}
  subscribeToProgress(callback: (data: AutoBuildProgressData) => void) {
    if (this.pendingLogs.length > 0) {
      for (const data of this.pendingLogs) {
        callback(data);
      }
      this.pendingLogs = [];
    }
    this.onProgress = callback;
  }
  async finish(): Promise<DeployAppVersion> {
    let app = await this.completedPromise;
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
    if (!app) {
      throw new Error("Error when building the app: build finished without deployed app");
    }
    return app;
  }
};

export const Wasmer = {
  autobuildApp: async (input: srcAutobuildMutation$variables['input']): Promise<AutobuildApp> => {
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
          reject(`The app could not be built: ${errors[0].message.toString()}`);
          return;
        }
        resolve(response);
      },
      onError: (error) => {
        reject(`The app could not be built: ${error.message.toString()}`);
      },
      variables: {
        input
      },
      })
    }));
    // console.log(query.deployViaAutobuild.buildId);
    const app = new AutobuildApp(query.deployViaAutobuild.buildId);
    return app;
  }
}
export const init = async (settings: WasmerRegistryConfig) => {
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
