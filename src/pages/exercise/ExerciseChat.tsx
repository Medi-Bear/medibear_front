// // ExerciseChat.tsx
// import { useState } from "react";
// import ChatMessageBubble_exercise from "../../components/ChatMessageBubble_exercise";
// import InputBar from "../../components/InputBar/InputBar";
// import { getUserEmail } from "../../utils/getUserEmail";
// import { autoRefreshCheck } from "../../utils/TokenUtils";
// import MultiMessageList from "../../components/chat/MultiMessageList";
// import MultiChatInputBar from "../../components/chat/MultiChatInputBar";
// import MultiChatLayout from "../../layouts/ChatBotLayout";

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
//     <MultiChatLayout>
//       <MultiMessageList messages={messages} loading={loading} bottomRef={bottomRef} logo={exerciseBear} />
//       <MultiChatInputBar onSend={onSend} />
//     </MultiChatLayout>
//   );
// }

// ExerciseChat.tsx
"use client";

import { useState, useRef } from "react";

// ⭐ 추가: 로고 이미지 import
import exerciseBear from "../../assets/medibear.png";

import MultiChatLayout from "../../layouts/ChatBotLayout";
import MultiMessageList from "../../components/chat/MultiMessageList";
import MultiChatInputBar from "../../components/chat/MultiChatInputBar";

import { getUserEmail } from "../../utils/getUserEmail";
import { autoRefreshCheck } from "../../utils/TokenUtils";

// FastAPI 서버
const API_URL = "http://localhost:8080/exercise/analyze";

type SendArgs = { text?: string; base64Image?: string; base64Video?: string };

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

// -----------------------------
// 메인 컴포넌트
// -----------------------------
export default function ExerciseChat() {
  type ChatMessage = {
    role: "user" | "assistant";   // ⭐ MultiMessageList 규격에 맞게 수정
    content?: string;
    base64Image?: string;
    base64Video?: string;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // ⭐ 추가: 로딩 상태
  const [loading, setLoading] = useState(false);

  // ⭐ 추가: 스크롤 위치 유지용 Ref
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const onSend = async ({ text, base64Image, base64Video }: SendArgs) => {
    const trimmed = (text ?? "").trim();
    const hasMedia = !!(base64Image || base64Video);

    // 1) 사용자 메시지 추가
    if (trimmed || hasMedia) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",   // ⭐ 수정됨
          content: trimmed,
          base64Image,
          base64Video,
        },
      ]);
    }

    try {
      setLoading(true); // ⭐ 추가

      // 2) 서버 호출
      const data = await sendToServer({
        text: trimmed,
        base64Image,
        base64Video,
      });

      // 3) 응답 메시지 추출
      const answer =
        data?.answer ??
        data?.detected_exercise ??
        (typeof data === "string" ? data : JSON.stringify(data));

      // 4) AI 응답 추가
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
          content: `에러: ${e.message}`,
        },
      ]);
    } finally {
      setLoading(false); // ⭐ 추가
    }
  };

  return (
    <MultiChatLayout>
      <MultiMessageList
        messages={messages}     // ⭐ OK
        loading={loading}       // ⭐ OK
        bottomRef={bottomRef}   // ⭐ OK
        logo={exerciseBear}     // ⭐ OK
      />
      <MultiChatInputBar onSend={onSend} />
    </MultiChatLayout>
  );
}

