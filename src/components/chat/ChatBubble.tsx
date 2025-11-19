import { useEffect, useRef } from "react";
import TypeIt from "typeit";

interface Props {
  from: "user" | "ai";
  text: string;
  isLast: boolean;

  // 🔥 추가
  autoScroll: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessageBubble({ from, text, isLast, autoScroll, scrollRef }: Props) {
  const isUser = from === "user";
  const typeRef = useRef<HTMLDivElement>(null);

  // TypeIt 애니메이션 + 자동 스크롤
  useEffect(() => {
    if (!isUser && isLast && typeRef.current) {
      typeRef.current.innerHTML = "";

      new TypeIt(typeRef.current, {
        speed: 10,
        waitUntilVisible: true,
        cursor: false,

        // 🔥 타이핑 한 글자마다 아래로
        afterStep: () => {
          if (autoScroll) {
            scrollRef.current?.scrollIntoView({
              behavior: "auto",
              block: "end",
            });
          }
        }
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
          max-w-[480px] px-4 py-3 rounded-2xl shadow-sm text-black text-[15px] leading-snug whitespace-pre-wrap
          ${isUser ? "bg-[#D2B48C]" : "bg-[#FAF3E0]"}
        `}
      >
        {isUser ? (
          text
        ) : isLast ? (
          <div ref={typeRef}></div>
        ) : (
          text
        )}
      </div>
    </div>
  );
}
