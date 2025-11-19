"use client";

import { useState, useRef, useEffect } from "react";
import { getUserEmail } from "../../utils/getUserEmail";
import { autoRefreshCheck } from "../../utils/TokenUtils";

import ChatLayout from "../../layouts/ChatBotLayout";
import ChatInputBar from "../../components/chat/ChatInputBar";
import MessageList from "../../components/chat/MessageList";
import sleepBear from "../../assets/sleepbear.png";

import {
  getDailyReport,
  getWeeklyReport,
} from "../../services/SleepServices/ReportServices";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SleepChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const email = getUserEmail();

  // 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 LLM 메시지 전송
  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!email) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "로그인이 필요합니다." },
      ]);
      return;
    }

    // user 입력
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const res = await autoRefreshCheck({
        url: "/chat/message",
        method: "POST",
        data: { email, message: trimmed },
      });

      const botResponse =
        res.data?.response || "LLM 응답을 가져오지 못했습니다.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: botResponse },
      ]);
    } catch (err) {
      console.error("LLM 요청 실패:", err);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "서버 연결 중 오류가 발생했습니다." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 리포트 호출 (ChatInputBar에서 호출됨)
  const handleReport = async (type: "daily" | "weekly") => {
    const title = type === "daily" ? "일간 리포트" : "주간 리포트";

    // ❗ 우선 사용자 메시지로 화면에 표시
    setMessages((prev) => [...prev, { role: "user", content: title }]);

    try {
      const res =
        type === "daily" ? await getDailyReport() : await getWeeklyReport();

      const content =
        res?.report || `${title}를 가져왔습니다.`; // LLM 리포트 내용

      // assistant 메시지 추가
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content },
      ]);
    } catch (err) {
      console.error("리포트 요청 실패:", err);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "리포트를 가져오지 못했습니다." },
      ]);
    }
  };

  return (
    <ChatLayout>
      <MessageList
        messages={messages}
        loading={loading}
        bottomRef={bottomRef}
        logo={sleepBear}
      />

      {/* 리포트 버튼 제거됨 */}

      <ChatInputBar
        onSend={handleSend}
        onReport={handleReport} // 🔥 리포트 기능 ChatInputBar로 연결됨
      />
    </ChatLayout>
  );
}
