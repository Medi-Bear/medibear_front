// ExerciseChat.tsx
import { useState } from "react";
import ChatMessageBubble from "../../components/ChatMessageBubble";
import InputBar from "../../components/InputBar/InputBar";
// import axios from "../../config/setAxios" // ← 안 쓰면 지워도 됨

// --- 1) 헬퍼는 컴포넌트 밖/별도 파일 ---
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string); // "data:...;base64,AAAA..."
    r.onerror = reject;
    r.readAsDataURL(file);
  });

// 서버 한 곳으로 통일 (FastAPI 예시)
const API_URL = "http://localhost:5000/analyze";

type SendArgs = { text?: string; base64Image?: string; base64Video?: string };

async function sendToServer({ text, base64Image, base64Video }: SendArgs) {
  const payload: any = { userId: "user1", message: text ?? "" };
  if (base64Image) payload.image = base64Image;
  if (base64Video) payload.video = base64Video;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.text();
  let json: any;
  try { json = JSON.parse(body); } catch { json = { raw: body }; }

  if (!res.ok) throw new Error(json?.detail ?? `HTTP ${res.status}`);
  return json;
}

export default function ExerciseChat() {
  const [messages, setMessages] = useState<{ from: "user" | "ai"; text: string }[]>([]);

  // --- 2) InputBar로 넘길 onSend: 서버 콜 + 메시지 상태 업데이트 ---
  const onSend = async ({ text, base64Image, base64Video }: SendArgs) => {
    // 화면에 내 메시지 먼저 붙임
    if (text) {
      setMessages((prev) => [...prev, { from: "user", text }]);
    }
    try {
      const data = await sendToServer({ text, base64Image, base64Video });
      const answer =
        data?.answer ??
        data?.detected_exercise ??
        (typeof data === "string" ? data : JSON.stringify(data));
      setMessages((prev) => [...prev, { from: "ai", text: String(answer) }]);
    } catch (e: any) {
      setMessages((prev) => [...prev, { from: "ai", text: `에러: ${e.message}` }]);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#FFF" }}>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 80px" }}>
        {/* 채팅 영역 */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 40 }}>
          {messages.length === 0 && (
            <div style={{ width: 420, height: 120, background: "#FAF3E0", borderRadius: 22, padding: 26 }}>
              대화 내용
            </div>
          )}
          {messages.map((m, i) => <ChatMessageBubble key={i} text={m.text} from={m.from} />)}
        </div>

        {/* 입력 바: onSend에 text + base64(있으면) 넘겨야 함 */}
        <div style={{ marginTop: 20 }}>
          <InputBar variant="exercise" onSend={onSend} />
        </div>
      </main>
    </div>
  );
}
