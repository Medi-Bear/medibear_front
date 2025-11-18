import React from "react";
import ChatMessageBubble from "./ChatBubble";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface Props {
  messages: Message[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
  loading: boolean;
  logo: string; 
}

export default function MessageList({ messages, bottomRef, loading, logo }: Props) {
  return (
    <div
      className="
        relative
        w-full max-w-[1027px] flex-1
        px-4 md:px-6 lg:px-8 py-8
        flex flex-col gap-3
        overflow-y-auto
      "
    >

      {/* ⭐ 메시지가 없을 때만 중앙 로고 노출 */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <img src={logo} className="w-32 h-auto object-contain" />

          <p className="text-[#6d8f9b] mt-3 text-center leading-tight">
            Medibear 수면 AI 챗봇
          </p>
        </div>
      )}

      {/* ⭐ 채팅 메시지 */}
      {messages.map((msg, idx) => {
        const isLastAssistant =
          msg.role === "assistant" && idx === messages.length - 1;

        return (
          <ChatMessageBubble
            key={idx}
            from={msg.role === "user" ? "user" : "ai"}
            text={msg.content}
            isLast={isLastAssistant}
          />
        );
      })}

      {/* 로딩 */}
      {loading && (
        <div className="self-start bg-gray-200 p-3 rounded-xl">
          응답 생성 중...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
