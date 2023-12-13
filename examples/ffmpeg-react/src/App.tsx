import React, { useState, useRef, useCallback, useEffect } from "react";

import {
  Directory,
  Wasmer,
  init,
  initializeLogger,
  Runtime,
} from "@wasmer/sdk";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useDropzone } from "react-dropzone";

async function readStream<T>(
  stream: ReadableStream<T>,
  cb: (data: T) => Promise<void> | void
) {
  const reader = stream.getReader();
  for (
    let result = await reader.read();
    !result.done;
    result = await reader.read()
  ) {
    await cb(result.value);
  }
}

interface VideoProps {
  preview: boolean;
  fileSrc?: ReturnType<typeof URL.createObjectURL>;
  file: File | null;
}

let loggerInitialized = false;

function App() {
  const [userVideo, setUserVideo] = useState<VideoProps>({
    preview: false,
    fileSrc: "",
    file: null,
  });
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const [fileU8Arr, setFileU8Arr] = useState<Uint8Array | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setUserVideo({
      preview: true,
      fileSrc: URL.createObjectURL(file),
      file,
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "video/*": [],
    },
    onDrop,
  });

  useEffect(() => {
    if (!userVideo.fileSrc || !previewVideoRef.current) return;
    previewVideoRef.current?.load();
  }, [userVideo.fileSrc]);

  useEffect(() => {
    (async () => {
      if (loggerInitialized) return;
      loggerInitialized = true;
      await init();
      initializeLogger(
        "info,wasmer_wasix=debug,wasmer_wasix::syscalls=debug,wasmer_js=debug"
      );
    })();
  }, []);

  useEffect(() => {
    if (!userVideo.file) {
      return;
    }
    const reader = new FileReader();

    reader.onload = function (e: ProgressEvent<FileReader>) {
      if (!e.target) return;
      const arrayBuffer = e.target.result as ArrayBuffer;
      const u8arr = new Uint8Array(arrayBuffer);

      setFileU8Arr(u8arr);
    };

    reader.readAsArrayBuffer(userVideo.file);
  }, [userVideo.file]);

  const runFfmpegProcessing = async () => {
    if (!fileU8Arr) return;

    const tmp = new Directory();
    await tmp.writeFile("input.mp4", fileU8Arr);
    const pkg = await Wasmer.fromRegistry("wasmer/ffmpeg");

    // const ffmpeg = pkg.commands["ffmpeg"].binary();
    if (!pkg.entrypoint) return;

    const instance = await pkg.entrypoint!.run({
      args: ["-i", "/videos/input.mp4", "/videos/output.avi"],
      mount: { "/videos": tmp },
    });
    console.log("waiting");

    // await instance.stdin?.close();
    // let output = await instance.wait();

    // console.log(output);
    // if (output.ok) {
    //   const contents = await tmp.readFile("output.mp4");
    //   console.log(contents.buffer);
    // } else {
    //   console.log(new TextDecoder().decode(output.stderr));
    // }
  };

  return (
    <main className=" bg-gray-800 h-full w-full flex flex-col justify-center items-center">
      <div className="col-span-full">
        <label
          htmlFor="cover-photo"
          className="block text-sm font-medium leading-6 text-white"
        >
          Upload a video
        </label>
        <div
          {...getRootProps({ className: "" })}
          className="mt-2 flex justify-center rounded-lg border border-dashed border-white px-6 py-10"
        >
          <div className="text-center">
            <PhotoIcon
              className="mx-auto h-12 w-12 text-gray-200"
              aria-hidden="true"
            />
            <div className="mt-4 flex text-sm leading-6 text-white">
              <label
                htmlFor="video-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="video-upload"
                  name="video-upload"
                  type="file"
                  className="sr-only"
                  {...getInputProps()}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-white/50">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>

      <video
        ref={previewVideoRef}
        width="260"
        height="150"
        controls
        crossOrigin="anonymous"
      >
        <source src={userVideo.fileSrc} />
        Your browser does not support the video tag.
      </video>
      <button
        disabled={!fileU8Arr}
        onClick={runFfmpegProcessing}
        type="button"
        className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
      >
        Run FFmpeg Processing
      </button>
    </main>
  );
}

export default App;
