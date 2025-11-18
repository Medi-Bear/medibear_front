"use client";

import React from "react";
import MultiChatBubble from "./MultiChatBubble";

export type MultiMessage = {
  role: "user" | "assistant";
  content?: string;
  base64Image?: string;
  base64Video?: string;
};

interface MultiMessageListProps {
  messages: MultiMessage[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
  loading: boolean;
  logo: string;     
}

export default function MultiMessageList({
  messages,
  bottomRef,
  loading,
  logo,
}: MultiMessageListProps) {
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

      {/*메시지가 없을 때 로고 표시 */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <img src={logo} className="w-32 h-auto object-contain" />
          <p className="text-[#6d8f9b] mt-3 text-center leading-tight">
            Medibear 운동 AI 코치
          </p>
        </div>
      )}

      {/* 메시지 렌더링 */}
      {messages.map((msg, idx) => {
        const isLastAssistant =
          msg.role === "assistant" && idx === messages.length - 1;

        return (
          <MultiChatBubble
            key={idx}
            from={msg.role}
            text={msg.content}
            image={msg.base64Image}
            video={msg.base64Video}
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
