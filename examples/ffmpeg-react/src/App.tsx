import { useState, useRef, useCallback, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useDropzone } from "react-dropzone";
import { useWasmerPackage, useWasmerSdk } from "./hooks";

interface VideoProps {
  preview: boolean;
  fileSrc?: ReturnType<typeof URL.createObjectURL>;
  file: File | null;
}

enum PROCESSING_STATUS {
  NOT_STARTED,
  RUNNING,
  FINISHED,
  FAILED,
}

export default function App() {
  const sdk = useWasmerSdk();
  const pkg = useWasmerPackage("wasmer/ffmpeg");
  console.log(pkg);

  const [userVideo, setUserVideo] = useState<VideoProps>({
    preview: false,
    fileSrc: "",
    file: null,
  });

  const [outputVideo, setOutputVideo] = useState<VideoProps>({
    preview: false,
    fileSrc: "",
    file: null,
  });

  const [processingStatus, setProcessingStatus] = useState<PROCESSING_STATUS>(
    PROCESSING_STATUS.NOT_STARTED,
  );

  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const outputVideoRef = useRef<HTMLVideoElement>(null);

  const [fileU8Arr, setFileU8Arr] = useState<Uint8Array | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    console.log(file);
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
    if (!outputVideo.fileSrc || !outputVideoRef.current) return;
    outputVideoRef.current?.load();
  }, [outputVideo.fileSrc]);

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

  useEffect(() => {
    if (processingStatus === PROCESSING_STATUS.FAILED) {
      setTimeout(() => {
        setProcessingStatus(PROCESSING_STATUS.NOT_STARTED);
      }, 4000);
    }
  }, [processingStatus]);
  const runFfmpegProcessing = async () => {
    if (!fileU8Arr || sdk.state != "loaded") return;

    setProcessingStatus(PROCESSING_STATUS.RUNNING);

    const tmp = new sdk.Directory();
    await tmp.writeFile("input.mp4", fileU8Arr);

    if (pkg.state != "loaded" || !pkg.pkg.entrypoint) return;

    const instance = await pkg.entrypoint!.run({
      args: [
        "-i",
        "/videos/input.mp4",
        "-vf",
        "format=gray",
        "/videos/output.mp4",
      ],
      mount: { "/videos": tmp },
    });

    await instance.stdin?.close();
    let output = await instance.wait();

    if (output.ok) {
      console.log(output.stderr);
      const contents = await tmp.readFile("output.mp4");

      const u8arr = new Uint8Array(contents.buffer);
      const file = new File([u8arr], "output.mp4", {
        type: "video/mp4",
      });
      setOutputVideo({
        preview: true,
        fileSrc: URL.createObjectURL(file),
        file,
      });
      setProcessingStatus(PROCESSING_STATUS.FINISHED);
    } else {
      console.log(output.stderr);
      setProcessingStatus(PROCESSING_STATUS.FAILED);
    }
  };

  return (
    <main className=" bg-gray-800 h-full w-full flex flex-col justify-center items-center space-y-4">
      {!!userVideo.fileSrc ? (
        <div className="flex space-x-4">
          <div className="space-y-2">
            <span className="block text-md font-medium leading-6 text-white">
              Input video
            </span>
            <video
              ref={previewVideoRef}
              width="480"
              controls
              crossOrigin="anonymous"
              className=" rounded-md shadow-sm"
            >
              <source src={userVideo.fileSrc} />
              Your browser does not support the video tag.
            </video>
          </div>

          {!!outputVideo.fileSrc &&
            processingStatus === PROCESSING_STATUS.FINISHED && (
              <div className="space-y-2">
                <span className="block text-md font-medium leading-6 text-white">
                  Output Video
                </span>
                <video
                  ref={outputVideoRef}
                  width="480"
                  controls
                  crossOrigin="anonymous"
                  className=" rounded-md shadow-sm"
                >
                  <source src={outputVideo.fileSrc} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
        </div>
      ) : (
        <div className="col-span-full">
          <label
            htmlFor="video-upload"
            className="block text-sm font-medium leading-6 text-white"
          >
            Upload a video
          </label>
          <div
            {...getRootProps({ className: "" })}
            className="mt-2 flex justify-center rounded-lg border border-dashed border-white px-6 py-10 group cursor-pointer"
          >
            <div className="text-center">
              <PhotoIcon
                className="mx-auto h-12 w-12 text-gray-200 group-hover:scale-105 group-active:scale-[98%] transition-transform duration-150"
                aria-hidden="true"
              />
              <div className="mt-4 flex text-sm leading-6 text-white">
                <label
                  htmlFor="video-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-600 hover:scale-[102%] active:scale-[98%] transition-transform duration-150"
                >
                  <span className="px-1">Upload a file</span>
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
                MP4, M4A, AVI up to 10MB
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        disabled={!fileU8Arr || pkg.state != "loaded"}
        onClick={runFfmpegProcessing}
        type="button"
        className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-100"
      >
        <ProcessingStatus status={processingStatus} />
      </button>

      {outputVideo.fileSrc && (
        <a
          download={outputVideo.file}
          href={outputVideo.fileSrc}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Download
        </a>
      )}
    </main>
  );
}

function ProcessingStatus({ status }: { status: PROCESSING_STATUS }) {
  switch (status) {
    case PROCESSING_STATUS.FAILED:
      return (
        <div className="text-red-600">Processing failed. Please try again.</div>
      );
    case PROCESSING_STATUS.FINISHED:
      return <div className="text-green-600">Processing finished.</div>;
    case PROCESSING_STATUS.RUNNING:
      return (
        <div className="text-yellow-600">
          FFmpeg is processing. Please wait.
        </div>
      );
    case PROCESSING_STATUS.NOT_STARTED:
      return <div className="text-indigo-600">Run FFmpeg Processing</div>;
  }
}
