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
    cb: (data: T) => Promise<void> | void,
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

enum PROCESSING_STATUS {
    NOT_STARTED,
    RUNNING,
    FINISHED,
    FAILED,
}

function App() {
    const [userVideo, setUserVideo] = useState<VideoProps>({
        preview: false,
        fileSrc: "",
        file: null,
    });

    const [processingStatus, setProcessingStatus] = useState<PROCESSING_STATUS>(
        PROCESSING_STATUS.NOT_STARTED,
    );

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
                "info,wasmer_wasix=debug,wasmer_wasix::syscalls=debug,wasmer_js=debug",
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

    useEffect(() => {
        if (processingStatus === PROCESSING_STATUS.FAILED) {
            setTimeout(() => {
                setProcessingStatus(PROCESSING_STATUS.NOT_STARTED);
            }, 4000);
        }
    }, [processingStatus]);
    const runFfmpegProcessing = async () => {
        if (!fileU8Arr) return;

        setProcessingStatus(PROCESSING_STATUS.RUNNING);

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

        await instance.stdin?.close();
        let output = await instance.wait();

        console.log(output);
        if (output.ok) {
            const contents = await tmp.readFile("output.mp4");
            console.log(contents.buffer);
            setProcessingStatus(PROCESSING_STATUS.FINISHED);
        } else {
            console.log(new TextDecoder().decode(output.stderr));
            setProcessingStatus(PROCESSING_STATUS.FAILED);
        }
    };

    const showProcessingStatus = () => {
        switch (processingStatus) {
            case PROCESSING_STATUS.FAILED:
                return (
                    <div className="text-red-600">
                        Processing failed. Please try again.
                    </div>
                );
            case PROCESSING_STATUS.FINISHED:
                return (
                    <div className="text-green-600">Processing finished.</div>
                );
            case PROCESSING_STATUS.RUNNING:
                return (
                    <div className="text-yellow-600">
                        FFmpeg is processing. Please wait.
                    </div>
                );
            case PROCESSING_STATUS.NOT_STARTED:
                return (
                    <div className="text-indigo-600">Run FFmpeg Processing</div>
                );
        }
    };

    return (
        <main className=" bg-gray-800 h-full w-full flex flex-col justify-center items-center space-y-4">
            {!!userVideo.fileSrc ? (
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
            ) : (
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
            )}

            <button
                disabled={!fileU8Arr}
                onClick={runFfmpegProcessing}
                type="button"
                className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-100"
            >
                {showProcessingStatus()}
            </button>
        </main>
    );
}

export default App;
