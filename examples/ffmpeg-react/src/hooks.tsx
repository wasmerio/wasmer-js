import React, { useContext, useEffect, useState } from "react";
import { Runtime, Wasmer, init, initializeLogger } from "@wasmer/sdk";

export type WasmerSdkState = { state: "loading" } | { state: "loaded" } | { state: "error", error: any };

export type WasmerSdkProps = {
    logFilter?: string,
    wasm?: Parameters<typeof init>[0],
    children: React.ReactElement,
}

const Context = React.createContext<WasmerSdkState | null>(null);

let pending: Promise<void> | undefined = undefined;

/**
 * A wrapper component which will automatically initialize the Wasmer SDK.
 * @param props
 * @returns
 */
export function WasmerSDK(props?: WasmerSdkProps) {
    const [state, setState] = useState<WasmerSdkState>();

    useEffect(() => {
        if (typeof pending == "undefined") {
            pending = init(props?.wasm).then(() => initializeLogger(props?.logFilter));
        }

        pending
            .then(() => setState({ state: "loaded" }))
            .catch(e => setState({ state: "error", error: e }));
    }, [])

    return (
        <Context.Provider value={state || { state: "loading" }}>
            {props?.children}
        </Context.Provider>
    )
}

export function useWasmerSdk(): WasmerSdkState {
    const ctx = useContext(Context);

    if (ctx == null) {
        throw new Error("Attempting to use the Wasmer SDK outside of a <WasmerSDK /> component");
    }

    return ctx;
}

type LoadingPackageState =
    { state: "loading-package" }
    | { state: "loaded", pkg: Wasmer }
    | { state: "error", error: any };
export type UseWasmerPackageState =
    | { state: "loading-sdk" }
    | { state: "sdk-error", error: any }
    | LoadingPackageState;

export function useWasmerPackage(pkg: string | Uint8Array, runtime?: Runtime): UseWasmerPackageState {
    const sdk = useWasmerSdk();
    const [state, setState] = useState<LoadingPackageState>();

    // We can't do anything until the SDK has been loaded
    switch (sdk.state) {
        case "error":
            return { state: "sdk-error", error: sdk.error };
        case "loading":
            return { state: "loading-sdk" };
    }

    if (typeof state != "undefined") {
        return state;
    }

    const newState = { state: "loading-package" } as const;
    setState(newState);

    const pending = (typeof pkg == "string")
        ? Wasmer.fromRegistry(pkg, runtime)
        : Wasmer.fromFile(pkg, runtime);

    pending
        .then(pkg => setState({ state: "loaded", pkg }))
        .catch(error => setState({ state: "error", error }));

    return newState;
}
