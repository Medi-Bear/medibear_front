import React, { useRef } from "react";
import ChatMessageBubble from "../chat/ChatBubble";

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
  // 🔥 스크롤 컨테이너 ref (overflow-y-auto가 적용된 div)
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 🔥 현재 스크롤이 아래에 있는지 판단
  const isAtBottom = () => {
    const el = scrollContainerRef.current;
    if (!el) return true;

    return el.scrollHeight - el.scrollTop - el.clientHeight < 5;
  };

  return (
    <div
      ref={scrollContainerRef}
      className="
        relative
        w-full max-w-[1027px] flex-1
        px-4 md:px-6 lg:px-8 py-8
        flex flex-col gap-3
        overflow-y-auto
      "
    >
      {/* 메시지 없을 때 중앙 로고 */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <img src={logo} className="w-32 h-auto object-contain" />
          <p className="text-[#6d8f9b] mt-3 text-center leading-tight">
            Medibear 수면 AI 챗봇
          </p>
        </div>
      )}

      {/* 메시지 렌더링 */}
      {messages.map((msg, idx) => {
        const isLastAssistant =
          msg.role === "assistant" && idx === messages.length - 1;

        return (
          <ChatMessageBubble
            key={idx}
            from={msg.role === "user" ? "user" : "ai"}
            text={msg.content}
            isLast={isLastAssistant}

            // 🔥 autoScroll 여부 전달 (맨 아래에 있을 때만 true)
            autoScroll={isAtBottom()}

            // 🔥 스크롤 목표 ref 전달
            scrollRef={bottomRef}
          />
        );
      })}

      {/* 로딩 표시 */}
      {loading && (
        <div className="self-start bg-gray-200 p-3 rounded-xl">
          응답 생성 중...
        </div>
      )}

      {/* 스크롤 맨 아래 임계 ref */}
      <div ref={bottomRef} />
    </div>
  );
}
