"use client";
import { useState, useRef, useEffect } from "react";
import { useExerciseMedia } from "../InputBar/ExerciseMediaInput";
import { useStressMedia } from "../InputBar/StressMediaInput";
import type { InputBarProps } from "../InputBar/types";

export default function InputBar({ variant, onSend }: InputBarProps) {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  // 공통 훅 연결
  const exerciseMedia = useExerciseMedia({ onSend });
  const stressMedia = useStressMedia({ onSend });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 자동 높이 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [text]);

  // 전송
  const handleSend = () => {
    if (!text.trim()) return;
    onSend({ text });
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1027px",
        border: "1px solid black",
        borderRadius: 20,
        background: "#FFF",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        margin: "20px auto",
        boxSizing: "border-box",
        gap: "10px",
      }}
    >
      {/* 왼쪽 영역 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          gap: 10,
          flexWrap: "wrap",
          minWidth: "200px",
        }}
      >
        {(variant === "exercise" || variant === "stress") && (
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setSelectedFileName("");
            }}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #ccc",
              background: "#FFF",
              color: "black",
              fontSize: "clamp(12px, 1.8vw, 14px)",
            }}
          >
            <option value="text">텍스트만</option>
            {variant === "exercise" && (
              <>
                <option value="image">이미지 업로드</option>
                <option value="video">동영상 업로드</option>
                <option value="webcam">웹캠 녹화</option>
              </>
            )}
            {variant === "stress" && (
              <option value="audio">음성 업로드</option>
            )}
          </select>
        )}

        {/* 텍스트 입력 */}
        <textarea
          ref={textareaRef}
          placeholder={
            variant === "sleep"
              ? "수면 관련 질문을 입력하세요"
              : variant === "exercise"
              ? "운동 관련 질문을 입력하세요"
              : "스트레스 관련 질문을 입력하세요"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            minWidth: "150px",
            border: "none",
            background: "transparent",
            fontSize: "clamp(13px, 2vw, 15px)",
            outline: "none",
            resize: "none",
            overflow: "hidden",
            color: "#000",
            lineHeight: 1.5,
          }}
          rows={1}
        />

        {/* 🎥 운동 미디어 */}
        {variant === "exercise" &&
          exerciseMedia.render(mode, setSelectedFileName, selectedFileName)}

        {/* 🎧 스트레스 미디어 */}
        {variant === "stress" &&
          stressMedia.render(mode, setSelectedFileName, selectedFileName)}
      </div>

      {/* 전송 버튼 */}
      <button
        onClick={handleSend}
        style={{
          backgroundColor: "#D2B48C",
          fontWeight: 600,
          border: "none",
          outline: "none",
          width: "clamp(70px, 18vw, 90px)",
          height: "clamp(45px, 12vw, 55px)",
          borderRadius: 20,
          cursor: "pointer",
          fontSize: "clamp(13px, 2vw, 15px)",
          alignSelf: "center",
          flexShrink: 0,
        }}
      >
        전송
      </button>
    </div>
  );
}
