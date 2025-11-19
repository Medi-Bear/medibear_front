import { useEffect, useRef } from "react";
import TypeIt from "typeit";

interface Props {
  from: "user" | "ai";
  text: string;
  isLast: boolean;
  autoScroll: boolean;  // 🔥 추가
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatBubble({ from, text, isLast, autoScroll, scrollRef }: Props) {
  const isUser = from === "user";
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // AI + 마지막 메시지일 때만 타이핑
    if (!isUser && isLast && typeRef.current) {
      typeRef.current.innerHTML = "";

      new TypeIt(typeRef.current, {
        speed: 20,
        waitUntilVisible: true,
        cursor: false,

        // 🔥 새 글자 찍힐 때마다 아래로 이동 (단 autoScroll = true 일 때만)
        afterStep: () => {
          if (autoScroll) {
            scrollRef.current?.scrollIntoView({ behavior: "auto" });
          }
        },
      })
        .type(text)
        .go();
    }
  }, [isUser, isLast, text, autoScroll]);

  return (
    <div
      className={`w-full flex mb-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[480px] px-4 py-3 rounded-2xl shadow-sm
          text-black text-[15px] leading-snug whitespace-pre-wrap
          ${isUser ? "bg-[#D2B48C]" : "bg-[#FAF3E0]"}
        `}
      >
        {isUser ? text : isLast ? <div ref={typeRef}></div> : text}
      </div>
    </div>
  );
}
