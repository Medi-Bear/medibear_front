"use client";
import { useState } from "react";
import EditProfileModal from "../../components/EditProfileModal"; // 경로는 실제 폴더 구조에 맞게 수정

export default function MyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = "user001"; // 로그인 후 실제 유저 아이디로 교체

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#FFFDF8",
        color: "#000",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* ✅ 회원 정보 수정 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "10px 24px",
          borderRadius: "999px",
          background: "#D2B48C",
          color: "#000",
          fontWeight: 600,
          fontSize: "14px",
          border: "none",
          outline: "none",
          cursor: "pointer",
        }}
      >
        회원 정보 수정
      </button>

      {/* 🪞 회원정보 수정 모달 */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
      />
    </div>
  );
}
