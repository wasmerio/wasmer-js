import React, { useContext, useEffect, useState } from "react";
import type {
  Command,
  Runtime,
  Wasmer,
  init,
  initializeLogger,
} from "@wasmer/sdk";

type LoadedSdkState = { state: "loaded" } & typeof import("@wasmer/sdk");
export type WasmerSdkState =
  | LoadedSdkState
  | { state: "loading" }
  | { state: "error"; error: any };

export type WasmerSdkProps = {
  /**
   * The filter passed to {@link initializeLogger}.
   */
  log?: string;
  wasm?: Parameters<typeof init>[0];
  children: React.ReactElement;
};

const Context = React.createContext<WasmerSdkState | null>(null);

// Note: The wasm-bindgen glue code only needs to be initialized once, and
// initializing the logger multiple times will throw an exception, so we use a
// global variable to keep track of the in-progress initialization.
let pending: Promise<typeof import("@wasmer/sdk")> | undefined = undefined;

/**
 * A wrapper component which will automatically initialize the Wasmer SDK.
 */
export function WasmerSdk(props?: WasmerSdkProps) {
  const [state, setState] = useState<WasmerSdkState>();

  useEffect(() => {
    if (typeof pending == "undefined") {
      pending = (async function () {
        console.log("Importing @wasmer/sdk");
        const imported = await import("@wasmer/sdk");
        console.log("Imported @wasmer/sdk");
        await imported.init({module: props?.wasm, log:props?.log});
        return imported;
      })();
    }

    pending
      .then(sdk => setState({ state: "loaded", ...sdk }))
      .catch(e => setState({ state: "error", error: e }));
  }, []);

  return (
    <Context.Provider value={state || { state: "loading" }}>
      {props?.children}
    </Context.Provider>
  );
}

export function useWasmerSdk(): WasmerSdkState {
  const ctx = useContext(Context);

  if (ctx == null) {
    throw new Error(
      "Attempting to use the Wasmer SDK outside of a <WasmerSDK /> component",
    );
  }

  return ctx;
}

type LoadingPackageState =
  | { state: "loading-package" }
  | {
      state: "loaded";
      pkg: Wasmer;
      commands: Record<string, Command>;
      entrypoint?: Command;
    }
  | { state: "error"; error: any };
export type UseWasmerPackageState =
  | { state: "loading-sdk" }
  | { state: "sdk-error"; error: any }
  | LoadingPackageState;

export function useWasmerPackage(
  pkg: string | Uint8Array,
  runtime?: Runtime,
): UseWasmerPackageState {
  const sdk = useWasmerSdk();
  const [state, setState] = useState<LoadingPackageState>();

  // We can't do anything until the SDK has been loaded
  switch (sdk.state) {
    case "error":
      return { state: "sdk-error", error: sdk.error };
    case "loading":
      return { state: "loading-sdk" };
    case "loaded":
      break;
    default:
      throw new Error(`Unknown SDK state: ${sdk}`);
  }

  if (typeof state != "undefined") {
    return state;
  }

  const newState = { state: "loading-package" } as const;
  setState(newState);

  console.warn("Loading pkg", pkg, state);

  const pending =
    typeof pkg == "string"
      ? sdk.Wasmer.fromRegistry(pkg, runtime)
      : sdk.Wasmer.fromFile(pkg, runtime);

  pending
    .then(pkg => {
      setState({
        state: "loaded",
        pkg,
        commands: pkg.commands,
        entrypoint: pkg.entrypoint,
      });
    })
    .catch(error => setState({ state: "error", error }));

  return newState;
}
