import { join } from "path";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import { useFileSystem } from "contexts/fileSystem";
import { useProcesses } from "contexts/process";
import {
  IMAGE_FILE_EXTENSIONS,
  PICUTRES_PATH,
  VIDEO_FILE_EXTENSIONS,
} from "utils/constants";
import {
  blobToBuffer,
  bufferToUrl,
  cleanUpBufferUrl,
  getExtension,
  getMimeType,
} from "utils/functions";

const CAMERA_DIRECTORY = join(PICUTRES_PATH, "Camera");
const isVideoPath = (path: string): boolean =>
  VIDEO_FILE_EXTENSIONS.has(getExtension(path));
const isMediaPath = (path: string): boolean =>
  IMAGE_FILE_EXTENSIONS.has(getExtension(path)) || isVideoPath(path);
type CameraMode = "photo" | "video";

const Camera: FC<ComponentProcessProps> = () => {
  const { deletePath, exists, mkdir, readFile, readdir, writeFile } =
    useFileSystem();
  const { open } = useProcesses();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const [loadingCamera, setLoadingCamera] = useState(true);
  const [cameraError, setCameraError] = useState("");
  const [mode, setMode] = useState<CameraMode>("photo");
  const [savingCapture, setSavingCapture] = useState(false);
  const [recording, setRecording] = useState(false);
  const [flash, setFlash] = useState(false);
  const [savedMedia, setSavedMedia] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState("");
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const ensureCameraDirectory = useCallback(async (): Promise<void> => {
    if (!(await exists(CAMERA_DIRECTORY))) {
      await mkdir(CAMERA_DIRECTORY);
    }
  }, [exists, mkdir]);

  const stopCamera = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    recorderRef.current = null;
    recordingChunksRef.current = [];
    setRecording(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const loadSavedMedia = useCallback(async (): Promise<void> => {
    try {
      await ensureCameraDirectory();
      const entries = await readdir(CAMERA_DIRECTORY);
      const media = entries
        .filter((entry) => isMediaPath(entry))
        .map((entry) => join(CAMERA_DIRECTORY, entry))
        .sort((a, b) => b.localeCompare(a));

      setSavedMedia(media);
      setSelectedMedia((currentSelection) =>
        currentSelection && media.includes(currentSelection)
          ? currentSelection
          : media[0] || ""
      );
    } catch {
      setSavedMedia([]);
    }
  }, [ensureCameraDirectory, readdir]);

  const startCamera = useCallback(async (): Promise<void> => {
    stopCamera();
    setLoadingCamera(true);
    setCameraError("");

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          height: { ideal: 1080 },
          width: { ideal: 1920 },
        },
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch {
      setCameraError(
        "Camera access failed. Allow camera permission in your browser and try again."
      );
    } finally {
      setLoadingCamera(false);
    }
  }, [stopCamera]);

  const saveVideoBlob = useCallback(
    async (videoBlob: Blob): Promise<void> => {
      await ensureCameraDirectory();
      const filePath = join(CAMERA_DIRECTORY, `Camera_${Date.now()}.webm`);

      await writeFile(filePath, await blobToBuffer(videoBlob), true);
      await loadSavedMedia();
      setSelectedMedia(filePath);
    },
    [ensureCameraDirectory, loadSavedMedia, writeFile]
  );

  const capturePhoto = useCallback(async (): Promise<void> => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) return;

    setSavingCapture(true);

    try {
      await ensureCameraDirectory();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      const filePath = join(CAMERA_DIRECTORY, `Camera_${Date.now()}.png`);

      await writeFile(filePath, await blobToBuffer(blob), true);
      setFlash(true);
      window.setTimeout(() => setFlash(false), 120);
      await loadSavedMedia();
      setSelectedMedia(filePath);
    } finally {
      setSavingCapture(false);
    }
  }, [ensureCameraDirectory, loadSavedMedia, writeFile]);

  const toggleVideoRecording = useCallback(async (): Promise<void> => {
    if (!streamRef.current) return;
    if (!("MediaRecorder" in window)) {
      setCameraError("Video recording is not supported in this browser.");
      return;
    }

    const currentRecorder = recorderRef.current;

    if (currentRecorder && currentRecorder.state === "recording") {
      currentRecorder.stop();
      return;
    }

    let mimeType = "video/webm";
    if (
      "isTypeSupported" in MediaRecorder &&
      MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ) {
      mimeType = "video/webm;codecs=vp9";
    }

    recordingChunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, { mimeType });

    recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        recordingChunksRef.current.push(event.data);
      }
    };
    recorder.onstop = async () => {
      setSavingCapture(true);
      try {
        const videoBlob = new Blob(recordingChunksRef.current, {
          type: mimeType,
        });
        recordingChunksRef.current = [];
        if (videoBlob.size > 0) await saveVideoBlob(videoBlob);
      } finally {
        setSavingCapture(false);
        setRecording(false);
      }
    };
    recorder.onerror = () => {
      setCameraError("Recording failed. Try restarting camera.");
      setRecording(false);
    };

    recorder.start(300);
    recorderRef.current = recorder;
    setRecording(true);
  }, [saveVideoBlob]);

  const onCapture = useCallback(async (): Promise<void> => {
    if (mode === "photo") {
      await capturePhoto();
    } else {
      await toggleVideoRecording();
    }
  }, [capturePhoto, mode, toggleVideoRecording]);

  const deleteSelectedMedia = useCallback(async (): Promise<void> => {
    if (!selectedMedia) return;

    await deletePath(selectedMedia);
    await loadSavedMedia();
  }, [deletePath, loadSavedMedia, selectedMedia]);

  useEffect(() => {
    startCamera();
    loadSavedMedia();

    return () => {
      stopCamera();
    };
  }, [loadSavedMedia, startCamera, stopCamera]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const loadedMedia = await Promise.all(
        savedMedia.map(async (mediaPath) => {
          try {
            const mediaBuffer = await readFile(mediaPath);

            return [
              mediaPath,
              bufferToUrl(mediaBuffer, getMimeType(mediaPath)),
            ] as const;
          } catch {
            return [mediaPath, ""] as const;
          }
        })
      );

      if (cancelled) {
        loadedMedia.forEach(([, url]) => {
          if (url) cleanUpBufferUrl(url);
        });

        return;
      }

      setPreviewUrls((currentUrls) => {
        Object.values(currentUrls).forEach(cleanUpBufferUrl);

        return Object.fromEntries(
          loadedMedia.filter(([, url]) => Boolean(url))
        ) as Record<string, string>;
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [readFile, savedMedia]);

  useEffect(
    () => () => {
      Object.values(previewUrls).forEach(cleanUpBufferUrl);
    },
    [previewUrls]
  );

  return (
    <div className="h-full w-full bg-[#0b0d12] text-white flex flex-col select-none">
      <div className="h-9 px-4 border-b border-[#2b2e35] bg-[#171920] flex items-center justify-between text-sm">
        <div className="font-semibold">Camera</div>
        <div className="text-xs text-gray-400">Users/Public/Pictures/Camera</div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />
          {flash && (
            <div className="absolute inset-0 bg-white/60 pointer-events-none" />
          )}
          {recording && (
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-xs font-semibold">
              REC
            </div>
          )}
          {(loadingCamera || cameraError) && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 text-center">
              <div className="max-w-md text-sm text-gray-200">
                {loadingCamera ? "Starting camera..." : cameraError}
              </div>
            </div>
          )}
        </div>

        <div className="h-[96px] border-t border-[#2b2e35] bg-[#11141a] px-2 py-2 overflow-x-auto overflow-y-hidden">
          <div className="h-full flex items-center gap-2">
            {savedMedia.length === 0 ? (
              <div className="text-sm text-gray-500 px-2">No captures yet.</div>
            ) : (
              savedMedia.map((mediaPath) => {
                const selected = selectedMedia === mediaPath;
                const isVideo = isVideoPath(mediaPath);
                const mediaName = mediaPath.split("/").pop() || mediaPath;

                return (
                  <button
                    key={mediaPath}
                    className={`relative h-full w-[124px] shrink-0 rounded border ${
                      selected
                        ? "border-[#2196f3] ring-1 ring-[#2196f3]"
                        : "border-[#343a45]"
                    } bg-[#1a1e26] overflow-hidden`}
                    title={mediaName}
                    onClick={() => setSelectedMedia(mediaPath)}
                  >
                    {previewUrls[mediaPath] &&
                      (isVideo ? (
                        <video
                          src={previewUrls[mediaPath]}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={previewUrls[mediaPath]}
                          alt={mediaName}
                          className="w-full h-full object-cover"
                        />
                      ))}
                    {isVideo && (
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white">
                        VIDEO
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="h-[108px] border-t border-[#2b2e35] bg-[#222942] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded bg-[#35405b] hover:bg-[#41506f] text-sm"
              onClick={startCamera}
            >
              Restart
            </button>
            <button
              className="px-3 py-2 rounded bg-[#4a3030] hover:bg-[#624141] disabled:opacity-60 text-sm"
              disabled={!selectedMedia}
              onClick={deleteSelectedMedia}
            >
              Delete
            </button>
            <button
              className="px-3 py-2 rounded bg-[#35405b] hover:bg-[#41506f] disabled:opacity-60 text-sm"
              disabled={!selectedMedia}
              onClick={() => {
                if (!selectedMedia) return;
                open(isVideoPath(selectedMedia) ? "VideoPlayer" : "Photos", {
                  url: selectedMedia,
                });
              }}
            >
              Open
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              className={`w-[82px] h-[82px] rounded-full border-[6px] ${
                recording
                  ? "bg-red-600 border-red-300"
                  : "bg-red-500 hover:bg-red-400 border-white"
              } transition-colors disabled:opacity-60`}
              disabled={loadingCamera || Boolean(cameraError) || savingCapture}
              onClick={onCapture}
              title={mode === "photo" ? "Take Photo" : recording ? "Stop Recording" : "Start Recording"}
            />
            <div className="text-[11px] text-gray-300">
              {mode === "photo"
                ? savingCapture
                  ? "Saving photo..."
                  : "Photo"
                : recording
                  ? "Recording..."
                  : savingCapture
                    ? "Saving video..."
                    : "Video"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-2 rounded text-sm ${
                mode === "photo"
                  ? "bg-[#2b7ed9] text-white"
                  : "bg-[#35405b] hover:bg-[#41506f]"
              }`}
              onClick={() => !recording && setMode("photo")}
            >
              Photo
            </button>
            <button
              className={`px-3 py-2 rounded text-sm ${
                mode === "video"
                  ? "bg-[#2b7ed9] text-white"
                  : "bg-[#35405b] hover:bg-[#41506f]"
              }`}
              onClick={() => !recording && setMode("video")}
            >
              Video
            </button>
            <button
              className="px-3 py-2 rounded bg-[#35405b] hover:bg-[#41506f] text-sm"
              onClick={() => open("FileExplorer", { url: CAMERA_DIRECTORY })}
            >
              Folder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Camera);
