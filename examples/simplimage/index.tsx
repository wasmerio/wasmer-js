import wasmUrl from "./simplimage/target/wasm32-wasi/release/simplimage.wasm?url";

import React from "react";

import ReactDOM from "react-dom/client";

function ImageEditor(props: { file: File }) {
  const { file } = props;
  const originalBlobUrl = URL.createObjectURL(props.file);

  const [resizeWidth, setResizeWidth] = React.useState<number | null>(100);
  const [resizeHeight, setResizeHeight] = React.useState<number | null>(100);

  const [error, setError] = React.useState<string | null>(null);

  const [outputBlob, setOutputBlob] = React.useState<Blob | null>(null);
  const [outputBlobUrl, setOutputBlobUrl] = React.useState<string | null>(null);

  const onSubmit = () => {
    if ((resizeWidth ?? 0) > 0 && (resizeHeight ?? 0) > 0) {
      resizeImage(file, resizeWidth ?? 0, resizeHeight ?? 0)
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setOutputBlob(blob);
          setOutputBlobUrl(url);
        })
        .catch(e => {
          setError(e.message);
        });
    }
  };

  return (
    <div className="mb-3 card">
      <div className="card-body">
        <div className="row" style={{ gap: "2rem" }}>
          <div className="col-6">
            <div>
              <p>
                <strong>Original</strong>
              </p>

              <p>Type: {file?.type}</p>
            </div>

            <div>
              <img
                src={originalBlobUrl}
                className="img-fluid"
                style={{ maxWidth: "400px" }}
              />
            </div>
          </div>
          <div className="col-6">
            <div>
              <p>
                <strong>Resize</strong>
              </p>
              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="200"
                  aria-label="width"
                  value={resizeWidth ?? ""}
                  onInput={e => {
                    try {
                      const value = parseInt(e.currentTarget.value);
                      setResizeWidth(value);
                    } catch (e) {}
                  }}
                />
                <span className="input-group-text">x</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="400"
                  aria-label="height"
                  value={resizeHeight ?? ""}
                  onInput={e => {
                    try {
                      const value = parseInt(e.currentTarget.value);
                      setResizeHeight(value);
                    } catch (e) {}
                  }}
                />
              </div>

              <div className="mb-3">
                <button
                  disabled={!resizeHeight || !resizeWidth}
                  className="btn btn-primary"
                  onClick={onSubmit}
                >
                  Convert
                </button>
              </div>

              <div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {outputBlobUrl && (
                  <div>
                    <p>
                      <strong>Output</strong>
                    </p>
                    <img
                      src={outputBlobUrl}
                      className="img-fluid"
                      style={{ maxWidth: "400px" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [file, setFile] = React.useState<File | null>(null);

  return (
    <div className="container mt-4 mb-3">
      <h2>image-tool</h2>

      <div>
        <div className="mb-3 card">
          <div className="card-body">
            <label htmlFor="formFile" className="form-label">
              <strong>Select an image to edit</strong>
            </label>
            <input
              className="form-control"
              type="file"
              id="img-input"
              accept="image/jpeg,image/jpg,image/png"
              onChange={e => {
                const file = e.currentTarget.files?.item(0);
                if (!file) {
                  return;
                }
                setFile(file);
              }}
            />
          </div>
        </div>

        {file && <ImageEditor file={file} />}
      </div>
    </div>
  );
}

async function main() {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
  );

  const preview = null;

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

async function initialize() {
  MODULE = await WebAssembly.compileStreaming(fetch(wasmUrl));
}

let MODULE: WebAssembly.Module | null = null;

async function resizeImage(
  file: File,
  width: number,
  height: number,
): Promise<Blob> {
  const { init, runWasix } = await import("@wasmer/sdk");
  await init({log: "debug"});

  if (!MODULE) {
    await initialize();

    if (!MODULE) {
      throw new Error("Failed to initialize module");
    }
  }

  const stdin = await file.arrayBuffer();

  const instance = await runWasix(MODULE, {
    args: [
      "resize",
      "--width",
      width.toString(),
      "--height",
      height.toString(),
    ],
    stdin: new Uint8Array(stdin),
  });

  const result = await instance.wait();
  if (result.code !== 0) {
    throw new Error(`Failed to convert image: ${result.stderr}`);
  }

  const blob = new Blob([result.stdoutBytes], { type: "image/png" });
  return blob;
}

main();
