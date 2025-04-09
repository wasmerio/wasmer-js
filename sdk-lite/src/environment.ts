import {
  type CacheConfig,
  type GraphQLResponse,
  type RequestParameters,
  type UploadableMap,
  type Variables,
  type QueryResponseCache as QueryResponseCacheType,
} from "relay-runtime";
import * as RelayRuntime from 'relay-runtime';
const { Environment, Network, QueryResponseCache, RecordSource, Store, Observable } = RelayRuntime;

export const graphql = RelayRuntime.graphql;
export const fetchQuery = RelayRuntime.fetchQuery;

import * as wsPkg from "persisted-subscriptions-transport-ws";
const { SubscriptionClient } = wsPkg;
// import { createClient, type Sink } from "graphql-ws";

const DEFAULT_CACHE_TTL = 30 * 1000; // 30 seconds, to resolve preloaded results

export async function networkFetch(
  endpoint: string,
  request: RequestParameters,
  variables: Variables,
  token?: string,
  uploadables?: UploadableMap | null,
): Promise<GraphQLResponse> {
  // remove null or undefined variables
  variables = Object.entries(variables)
    .filter(([_, value]) => value != null)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  const requestHeaders: any = {
    Accept: "application/json",
  };
  if (token?.length ?? 0 > 0) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  // console.info(
  //   `[ ${new Date().toUTCString()}:${new Date().getMilliseconds()}] Fetching ${endpoint} (${request.name})`,
  // );

  let body;
  if (uploadables && Object.keys(uploadables).length > 0) {
    // This path will only be followed from our client.
    // Hence, it's okay to assume this comes from our window.
    if (!globalThis.FormData) {
      throw new Error("Uploading files without `FormData` not supported.");
    }

    const formData = new FormData();
    if (request.text) {
      formData.append("query", request.text);
    }
    if (request.id) {
      formData.append("id", request.id);
    }
    formData.append("variables", JSON.stringify(variables));
    formData.append("operationName", request.name);

    Object.keys(uploadables).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
        formData.append(key, uploadables[key]);
      }
    });

    body = formData;
  } else {
    requestHeaders["Content-Type"] = "application/json";

    body = JSON.stringify({
      query: request.text,
      variables,
      operationName: request.name,
      id: request.id,
    });
  }

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: requestHeaders,
    body: body,
    // TODO: using 'cors' mode generate an error, it's not implemented by wrangler yet
    // mode: "cors",
  });

  const json: any = await resp.json();

  // console.info(
  //   `[ ${new Date().toUTCString()}:${new Date().getMilliseconds()}] Fetched (${request.name})`,
  // );
  // console.log(JSON.stringify(json, null, 2));

  return json;
}

function createCache(): QueryResponseCacheType {
  const responseCache = new QueryResponseCache({
    size: 100,
    ttl: DEFAULT_CACHE_TTL,
  });
  return responseCache;
}

function createNetwork(
  endpoint: string,
  responseCache: QueryResponseCacheType,
  token?: string,
) {
  const fetchResponse = async (
    params: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig,
    uploadables?: UploadableMap | null,
  ) => {
    const isQuery = params.operationKind === "query";
    const cacheKey = params.id ?? params.cacheID;
    const forceFetch = cacheConfig && cacheConfig.force;
    if (responseCache != null && isQuery && !forceFetch) {
      const fromCache = responseCache.get(cacheKey, variables);
      if (fromCache != null) {
        return Promise.resolve(fromCache);
      }
    }

    let response = await networkFetch(
      endpoint,
      params,
      variables,
      token,
      uploadables,
    );
    if (responseCache != null && isQuery) {
      responseCache.set(cacheKey, variables, response);
    }
    return response;
  };

  let network;
  // Create a shared subscription client that can be reused
  let subscriptionClient: any = null;
  let activeSubscriptions = 0;

  const getSubscriptionClient = () => {
    if (!subscriptionClient || subscriptionClient.status === 3) { // 3 = CLOSED
      subscriptionClient = new SubscriptionClient(
        endpoint.replace(/^http:\/\//, "ws://")?.replace(/^https:\/\//, "wss://"),
        {
          reconnect: true,
          lazy: true,
          connectionParams: {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        }
      );
    }
    return subscriptionClient;
  };

  const subscribe = (request: any, variables: any) => {
    // Get or create the subscription client
    const client = getSubscriptionClient();
    // Increment active subscriptions counter
    activeSubscriptions++;
    
    // Important: Convert subscriptions-transport-ws observable type to Relay's
    return Observable.create(sink => {
      const subscribeObservable = client.request({
        query: request.text,
        id: request.id,
        operationName: request.name,
        variables,
      });
      
      const subscription = subscribeObservable.subscribe({
        next: (data: any) => sink.next(data),
        error: (error: any) => sink.error(error),
        complete: () => {
          // console.log("COMPLETE");
          sink.complete();
        },
      });
      
      // Return a dispose function that will be called when the subscription is disposed
      return () => {
        // console.log("UNSUBSCRIBING");
        subscription.unsubscribe();
        
        // Decrement active subscriptions counter
        activeSubscriptions--;
        
        // If no more active subscriptions, close the client
        if (activeSubscriptions <= 0) {
          // console.log("CLOSING CLIENT - NO MORE ACTIVE SUBSCRIPTIONS");
          client.close();
          activeSubscriptions = 0; // Reset counter to avoid negative values
        }
        
        // console.log("UNSUBSCRIBED");
      };
    });
  };
  
  network = Network.create(fetchResponse, subscribe as any);

  return network;
}

export type EnvironmentOptions = {
  endpoint: string;
  token?: string;
  records?: any;
  isServer?: boolean;
  cache?: QueryResponseCacheType;
};

export function createEnvironment({
  endpoint,
  token,
  records,
  isServer,
  cache,
}: EnvironmentOptions) {
  cache = cache ?? createCache();
  const environment = new Environment({
    network: createNetwork(endpoint, cache, token)!,
    store: new Store(new RecordSource(records)),
    isServer,
    options: {
      cache,
    },
  });
  return environment;
}
