import { useRef, useState } from "react";

export function useExerciseMedia({ onSend }: { onSend: (data: any) => void }) {
  const [_recordedVideoBase64, setRecordedVideoBase64] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const toBase64 = (file: Blob) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const handleFileUpload = async (e: any, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    if (type === "image") onSend({ base64Image: base64 });
    else onSend({ base64Video: base64 });
  };

  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const startRecording = () => {
    chunksRef.current = [];
    recorderRef.current = new MediaRecorder(streamRef.current!, { mimeType: "video/webm" });
    recorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorderRef.current.start();
  };

  const stopRecording = () =>
    new Promise<void>((resolve) => {
      recorderRef.current!.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const base64 = await toBase64(blob);
        setRecordedVideoBase64(base64);
        onSend({ base64Video: base64 });
        resolve();
      };
      recorderRef.current?.stop();
    });

  const render = (
    mode: string,
    setSelectedFileName: (name: string) => void,
    selectedFileName: string
  ) => {
    if (mode === "image" || mode === "video") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label
            style={{
              border: "1.5px solid #D2B48C",
              borderRadius: 8,
              padding: "6px 12px",
              background: "#FAF3E0",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            {mode === "image" ? "이미지 선택" : "동영상 선택"}
            <input
              type="file"
              accept={mode === "image" ? "image/*" : "video/*"}
              onChange={(e) => {
                setSelectedFileName(e.target.files?.[0]?.name || "");
                handleFileUpload(e, mode as "image" | "video");
              }}
              style={{ display: "none" }}
            />
          </label>
          {selectedFileName && (
            <span style={{ fontSize: 13, color: "#6B4E2E" }}>{selectedFileName}</span>
          )}
        </div>
      );
    }

    if (mode === "webcam") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { label: "웹캠 켜기", onClick: startWebcam },
              { label: "녹화 시작", onClick: startRecording },
              { label: "녹화 종료", onClick: stopRecording },
              { label: "웹캠 종료", onClick: stopWebcam },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                style={{
                  border: "1.5px solid #D2B48C",
                  borderRadius: 8,
                  padding: "6px 10px",
                  background: "#FFF",
                  cursor: "pointer",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "clamp(120px, 25vw, 180px)",
              height: "clamp(80px, 18vw, 120px)",
              background: "#000",
              borderRadius: 8,
              marginTop: "4px",
            }}
          />
        </div>
      );
    }

    return null;
  };

  return { render };
}
