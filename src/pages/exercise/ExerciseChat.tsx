// // ExerciseChat.tsx
// import { useState } from "react";
// import ChatMessageBubble_exercise from "../../components/ChatMessageBubble_exercise";
// import InputBar from "../../components/InputBar/InputBar";
// import { getUserEmail } from "../../utils/getUserEmail";
// import { autoRefreshCheck } from "../../utils/TokenUtils";
// import MultiChatLayout from "../../layouts/ChatBotLayout";
// import MultiMessageList from "../../components/chat/MultiMessageList";
// import MultiChatInputBar from "../../components/chat/MultiChatInputBar";


// // FastAPI 서버
// const API_URL = "http://localhost:8080/exercise/analyze";

// type SendArgs = { text?: string; base64Image?: string; base64Video?: string };

// async function sendToServer({ text, base64Image, base64Video }: SendArgs) {
//   const email = getUserEmail();
//   const payload: any = {
//     userId: email,
//     message: text ?? ""
//   };

//   if (base64Image) payload.image = base64Image;
//   if (base64Video) payload.video = base64Video;

  
//   const res = await autoRefreshCheck({
//     url: API_URL,
//     method: "POST",
//     data: payload,
//     headers: {
//       "Content-Type": "application/json",
//     },
//     withCredentials: true,
//   });

//   return res.data;
// }

// // -----------------------------
// // 메인 컴포넌트
// // -----------------------------
// export default function ExerciseChat() {
//   type ChatMessage = {
//     from: "user" | "ai";
//     text?: string;
//     base64Image?: string;
//     base64Video?: string;
//   };

//   const [messages, setMessages] = useState<ChatMessage[]>([]);

//   const onSend = async ({ text, base64Image, base64Video }: SendArgs) => {
//     const trimmed = (text ?? "").trim();
//     const hasMedia = !!(base64Image || base64Video);

//     // 1) 사용자 메시지 추가
//     if (trimmed || hasMedia) {
//       setMessages(prev => [
//         ...prev,
//         {
//           from: "user",
//           text: trimmed,
//           base64Image,
//           base64Video,
//         },
//       ]);
//     }

//     try {
//       // 2) 서버 호출
//       const data = await sendToServer({
//         text: trimmed,
//         base64Image,
//         base64Video,
//       });

//       // 3) 응답 메시지 추출
//       const answer =
//         data?.answer ??
//         data?.detected_exercise ??
//         (typeof data === "string" ? data : JSON.stringify(data));

//       // 4) AI 응답 추가
//       setMessages(prev => [
//         ...prev,
//         {
//           from: "ai",
//           text: answer,
//         },
//       ]);
//     } catch (e: any) {
//       // 오류 처리
//       setMessages(prev => [
//         ...prev,
//         {
//           from: "ai",
//           text: `에러: ${e.message}`,
//         },
//       ]);
//     }
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", background: "#FFF" }}>
//       <main style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 80px" }}>
        
//         {/* 메시지 영역 */}
//         <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 40 }}>
//           {messages.length === 0 && (
//             <div style={{ width: 420, height: 120, background: "#FAF3E0", borderRadius: 22, padding: 26 }}>
//               대화 내용
//             </div>
//           )}
//           {messages.map((m, i) => (
//             <ChatMessageBubble_exercise
//               key={i}
//               text={m.text}
//               from={m.from}
//               base64Image={m.base64Image}
//               base64Video={m.base64Video}
//             />
//           ))}
//         </div>

//         {/* 입력바 */}
//         <div style={{ marginTop: 20 }}>
//           <InputBar variant="exercise" onSend={onSend} />
//         </div>
//       </main>
//     </div>
    
//   );
// }

"use client";

import { useRef, useState, useEffect } from "react";  // ⭐ 변경: useEffect 추가됨
import MultiChatLayout from "../../layouts/ChatBotLayout";
import MultiMessageList from "../../components/chat/MultiMessageList";
import type { MultiMessage } from "../../components/chat/MultiMessageList";

import MultiChatInputBar from "../../components/chat/MultiChatInputBar";
import { getUserEmail } from "../../utils/getUserEmail";
import { autoRefreshCheck } from "../../utils/TokenUtils";
import exerciseBear from "../../assets/medibear.png";

const API_URL = "http://localhost:8080/exercise/analyze";

type SendArgs = {
  text?: string;
  base64Image?: string;
  base64Video?: string;
};

async function sendToServer({ text, base64Image, base64Video }: SendArgs) {
  const email = getUserEmail();

  const payload: any = {
    userId: email,
    message: text ?? "",
  };

  if (base64Image) payload.image = base64Image;
  if (base64Video) payload.video = base64Video;

  const res = await autoRefreshCheck({
    url: API_URL,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  return res.data;
}

export default function ExerciseChatPage() {
  const [messages, setMessages] = useState<MultiMessage[]>([]);
  const [loading, setLoading] = useState(false);          // ⭐ 추가됨 (loading state)
  const bottomRef = useRef<HTMLDivElement | null>(null); // ⭐ 추가됨 (chat auto-scroll)

  const onSend = async ({ text, base64Image, base64Video }: SendArgs) => {
    const trimmed = text?.trim();
    const hasMedia = !!(base64Image || base64Video);

    // ⭐ 변경: MultiMessage 구조에 맞게 content, role 사용
    if (trimmed || hasMedia) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: trimmed,
          base64Image,
          base64Video,
        },
      ]);
    }

    try {
      setLoading(true);  // ⭐ 추가됨: loading start

      const data = await sendToServer({
        text: trimmed,
        base64Image,
        base64Video,
      });

      const answer =
        data?.answer ??
        data?.detected_exercise ??
        (typeof data === "string" ? data : JSON.stringify(data));

      // ⭐ 변경: AI 응답도 MultiMessage 구조로
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `에러 발생: ${e.message}`,
        },
      ]);
    } finally {
      setLoading(false); // ⭐ 추가됨: loading end
    }
  };

  // ⭐ 추가됨: 메시지 업데이트 시 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <MultiChatLayout>
      <MultiMessageList
        messages={messages}
        loading={loading}      // ⭐ 추가됨
        bottomRef={bottomRef}  // ⭐ 추가됨
        logo={exerciseBear}
      />

      <MultiChatInputBar onSend={onSend} />
    </MultiChatLayout>
  );
}
