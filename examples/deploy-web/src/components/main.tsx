"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { init, Wasmer, WasmerPackage } from "@wasmer/sdk";
import { useCallback, useEffect, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

export function Main() {
  // console.log("RENDER MAIN");
  const [deploymentStatus, setDeploymentStatus] = useState<"deploying" | "done" | null>();
  const [deploymentProgress, setDeploymentProgress] = useState<string>();
  const [deploymentDemoUrl, setDeploymentDemoUrl] = useState<string | null>();
 
  const [selectedApp, setSelectedApp] = useState<"static" | "js" | "php">("static");
  const [user, setUser] = useState<null | string>();
  const validToken =
    typeof window !== "undefined"
      ? localStorage.getItem("WASMER_TOKEN") || undefined
      : undefined;
  const setToken = useCallback(async (token: string) => {
    if (token.startsWith("wap_")) {
      await init({
        token,
      });
      let user = await Wasmer.whoami();
      if (user) {
        localStorage.setItem("WASMER_TOKEN", token);
        localStorage.setItem("WASMER_USERNAME", user.username);
        setUser(user.username);
      } else {
        localStorage.removeItem("WASMER_TOKEN");
        localStorage.removeItem("WASMER_USERNAME");
        setUser(null);
      }
    }
  }, []);
  let onBlur = useCallback(async (e: any) => {
    const token: string = e.target.value;
    setToken(token);
  }, []);
  var ranonce = false;
  useEffect(() => {
    // console.log("USE EFFECT", validToken);
    if (!ranonce) {
      if (typeof window !== "undefined") {
        (async () => {
          if (validToken) {
            await init({
              token: validToken,
            });
            let user = await Wasmer.whoami();
            if (user) {
              setUser(user.username);
            }
          }
        })();
      }
      ranonce = true;
    }
  }, []);
  useEffect(() => {
    setCodePackage(applications[selectedApp].manifest)
    setCodeApp(applications[selectedApp].app)
  }, [selectedApp, user]);
  const applications = {
    static: {
      manifest: `var files = {
  "myfile.txt": "My file",
  "dir": {
    "index.html": "<html><b>Hello world</b></html>",
  }
};

var manifest = {
  command: [
    {
      module: "wasmer/static-web-server:webserver",
      name: "script",
      runner: "https://webc.org/runner/wasi",
      annotations: {
        wasi: {
          "main-args": [
            "--directory-listing=true"
          ],
        },
      },
    },
  ],
  dependencies: {
    "wasmer/static-web-server": "^1",
  },
  fs: {
    "/public": files,
  },
};`,
      app: `let appConfig = {
  name: "my-static-app",
  owner: "${user}",
  package: package,
};`,
    },
    php: {
      manifest: `var indexPhp = \`<?php
echo "PHP app created from @wasmer/sdk!<br />";
var_dump($_ENV);\`;

var manifest = {
  command: [
    {
      module: "php/php:php",
      name: "run",
      runner: "https://webc.org/runner/wasi",
      annotations: {
        wasi: {
          "main-args": ["-t", "/app", "-S", "localhost:8080"],
        },
      },
    },
  ],
  dependencies: {
    "php/php": "=8.3.401",
  },
  fs: {
    "/app": {
      "index.php": indexPhp,
    },
  },
};`,
      app: `let appConfig = {
  name: "my-awesome-php-app",
  owner: "${user}",
  package: package,
  scaling: {
    mode: "single_concurrency",
  },
};`,
    },
    js: {
      manifest: `var indexJs = \`
async function handler(request) {
  const out = JSON.stringify({
    "HEY":"SDSFD!",
  });
  return new Response(out, {
    headers: { "content-type": "application/json" },
  });
}

addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(handler(fetchEvent.request));
});\`;

var manifest = {
  command: [
    {
      module: "wasmer/winterjs:winterjs",
      name: "script",
      runner: "https://webc.org/runner/wasi",
      annotations: {
        wasi: {
          env: ["JS_PATH=/src/index.js"],
          "main-args": ["/src/index.js"],
        },
      },
    },
  ],
  dependencies: {
    "wasmer/winterjs": "1.2.0",
  },
  fs: {
    "/src": {
      "index.js": indexJs,
    },
  },
};`,
      app: `let appConfig = {
  name: "my-awesome-js-app",
  owner: "${user}",
  package: package,
};`,
    }
  };
  const [codePackage, setCodePackage] = useState<string>(applications[selectedApp].manifest);
  const [codeApp, setCodeApp] = useState<string>(applications[selectedApp].app);
  const onDeployClick = useCallback(async() => {
    if (deploymentStatus == "deploying" || !user) {
      return;
    }
    setDeploymentDemoUrl(null);
    setDeploymentStatus("deploying");

    let progress = `Creating package...`;
    setDeploymentProgress(progress);
    // console.log("a");
    let packageFunc = new Function(`${codePackage}; return manifest;`);
    let manifest = packageFunc();

    console.info("Creating package with manifest", manifest);
    

    // console.log("c");

    let _package = await Wasmer.createPackage(manifest);

    progress += `\n  -> ${(_package as any).pkg.hash}`;
    setDeploymentProgress(progress);

    let appFunc = new Function('package', `${codeApp}; return appConfig;`);

    progress += `\n\nCreating app...`;
    setDeploymentProgress(progress);
    let appConfig = appFunc(_package);

    let app = await Wasmer.deployApp(appConfig);
    progress += `\n  -> ${app.url}`;
    setDeploymentProgress(progress);

    setDeploymentDemoUrl(app.url);
    setDeploymentStatus("done");

    // console.log(appConfig);

    // console.log(manifest);
  }, [deploymentStatus, codePackage, codeApp]);
  return (
    <div className="w-full min-h-dvh bg-background text-foreground">
      <header className="flex items-center justify-between px-4 py-6 md:px-6 lg:px-8">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <span className="text-xl font-bold">Wasmer JS SDK - Deploy demo</span>
        </Link>
      </header>
      <main className="container px-4 py-12 md:px-6 lg:py-24 flex flex-col md:flex-row gap-8 mx-auto">
        <div className="mx-auto max-w-2xl space-y-8 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Deploy your app with `@wasmer/sdk`
          </h1>
          <p className="text-muted-foreground md:text-xl">
            Streamline your deployment process with our intuitive platform.
            Choose from a variety of options to get your app up and running in
            no time.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Enter your token. Eg: `wap_...`"
                className="pr-4 w-full text-lg"
                defaultValue={validToken}
                onBlur={onBlur}
              />
              <div className="mt-2 text-center text-sm text-muted-foreground">
                {user ? (
                  `Hi ${user}!`
                ) : (
                  <>
                    Get your token from:{" "}
                    <Link
                      href="https://wasmer.io/settings/access-tokens"
                      target="_blank"
                    >
                      wasmer.io/settings/access-tokens
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <RadioGroup
              value={selectedApp}
              className="w-full"
              onValueChange={(e: "php" | "js" | "static") => {
                // console.log(e);
                setSelectedApp(e);
                // setCodePackage(applications[e].manifest)
                // setCodeApp(applications[e].app)
              }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Label
                  htmlFor="static"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem
                    value="static"
                    id="static"
                    className="peer sr-only"
                  />
                  <FileIcon className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Static Website</span>
                </Label>
                <Label
                  htmlFor="php"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem
                    value="php"
                    id="php"
                    className="peer sr-only"
                  />
                  <CodeIcon className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">PHP Application</span>
                </Label>
                <Label
                  htmlFor="js"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem
                    value="js"
                    id="js"
                    className="peer sr-only"
                  />
                  <BoltIcon className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">JavaScript Worker</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-4">
              <h2 className="text-lg font-bold">Package</h2>
              <CodeEditor
                value={codePackage}
                language="js"
                placeholder="Please enter manifest code."
                onChange={evn => setCodePackage(evn.target.value)}
                // onChange={(evn) => setCode(evn.target.value)}
                padding={15}
                style={{
                  backgroundColor: "#f5f5f5",
                  fontFamily:
                    "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                }}
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Application</h2>
              <CodeEditor
                value={codeApp}
                language="js"
                placeholder="Please enter app code."
                onChange={evn => setCodeApp(evn.target.value)}
                // onChange={(evn) => setCode(evn.target.value)}
                padding={15}
                style={{
                  backgroundColor: "#f5f5f5",
                  fontFamily:
                    "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                }}
              />
            </div>
        </div>
        <div className="bg-popover rounded-lg border p-6 shadow-lg w-full max-w-md mx-auto md:mx-0">
          <Button className="w-full mb-4" disabled={!user || deploymentStatus == "deploying"} onClick={onDeployClick}>Deploy now!</Button>
          {(deploymentStatus == "deploying" || deploymentStatus == "done") ? <><div className="space-y-4">
            <h2 className="text-2xl font-bold">Deployment Progress</h2>
            <div className="bg-background rounded-md p-4 text-sm font-mono overflow-hidden">
              <pre>
                <code>{deploymentProgress}</code>
              </pre>
            </div>
          </div>
          {deploymentDemoUrl && <iframe className="w-full aspect-square border" src={deploymentDemoUrl}/>}
          </>: null}

        </div>
      </main>
      <footer className="bg-muted py-6 text-center text-muted-foreground">
        <p>Demo provided by the Wasmer Team with ❤️</p>
      </footer>
    </div>
  );
}

function BoltIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}


function FileIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
