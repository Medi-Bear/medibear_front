"use client";
import { useEffect, useRef, useState } from "react";
import axios from "../config/setAxios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string; // 이메일(아이디)
}

export default function EditProfileModal({ isOpen, onClose, userId }: EditProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
  });
  const [isVerifying, setIsVerifying] = useState(false);

  // ESC 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // 모달 외부 클릭 시 닫기
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
  };

  if (!isOpen) return null;

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 비밀번호 변경 처리
  const handleSubmit = async () => {
    if (!formData.password || !formData.newPassword) {
      toast.warn("현재 비밀번호와 새 비밀번호를 모두 입력해주세요.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    try {
      setIsVerifying(true);

      // 1️⃣ 현재 비밀번호 검증
      const verify = await axios.post("/users/verify-password", {
        email: userId,
        password: formData.password,
      });

      if (!verify.data?.valid) {
        toast.error("현재 비밀번호가 올바르지 않습니다.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        setIsVerifying(false);
        return;
      }

      // 2️⃣ 새 비밀번호 변경 요청
      await axios.put(`/users/${userId}/update`, {
        newPassword: formData.newPassword,
      });

      toast.success("비밀번호가 성공적으로 변경되었습니다.", {
        position: "top-center",
        autoClose: 2200,
        theme: "colored",
      });

      onClose();
      setTimeout(() => window.location.reload(), 700);
    } catch (err) {
      console.error("❌ 비밀번호 변경 오류:", err);
      toast.error("비밀번호 변경 중 오류가 발생했습니다.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // ✅ 커스텀 탈퇴 확인 Toast
  const showDeleteConfirmToast = (onConfirm: () => void) => {
    toast(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "15px", marginBottom: "10px", color: "#333" }}>
            정말 탈퇴하시겠어요?
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <button
              onClick={() => {
                onConfirm();
                closeToast();
              }}
              style={{
                background: "#B38252",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              네, 탈퇴할래요
            </button>
            <button
              onClick={closeToast}
              style={{
                background: "#ccc",
                color: "#333",
                border: "none",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              취소
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: "light",
        style: {
          background: "#FAF3E0",
          border: "1px solid #D2B48C",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      }
    );
  };

  // 🗑️ 회원 탈퇴 처리
  const handleDeleteAccount = () => {
    showDeleteConfirmToast(async () => {
      try {
        await axios.delete(`/users/${userId}`);
        toast.success("회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.", {
          position: "top-center",
          autoClose: 2300,
          theme: "colored",
        });
        onClose();
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (err) {
        console.error("회원 탈퇴 오류:", err);
        toast.error("회원 탈퇴 중 오류가 발생했습니다.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    });
  };

  return (
    <>
      <ToastContainer style={{ zIndex: 11000}} />

      <div
        onClick={handleOutsideClick}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          ref={modalRef}
          style={{
            background: "#FAF3E0",
            borderRadius: 20,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            width: "420px",
            padding: "32px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "16px",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#B38252",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            ×
          </button>

          {/* 제목 */}
          <h2
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: 600,
              color: "#B38252",
              marginBottom: "24px",
            }}
          >
            비밀번호 변경
          </h2>

          {/* 입력 영역 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              alignItems: "center",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            <ReadOnlyField label="이메일 (아이디)" value={userId} />
            <InputField
              label="현재 비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <InputField
              label="새 비밀번호"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          {/* 버튼 영역 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              marginTop: "32px",
              width: "100%",
            }}
          >
            {/* 취소 / 저장 버튼 */}
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button
                onClick={onClose}
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  background: "#ccc",
                  color: "#333",
                  border: "none",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={isVerifying}
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  background: isVerifying ? "#D2B48Caa" : "#D2B48C",
                  color: "#000",
                  fontWeight: 600,
                  border: "none",
                  cursor: isVerifying ? "not-allowed" : "pointer",
                }}
              >
                {isVerifying ? "변경 중..." : "저장"}
              </button>
            </div>

            {/* 회원 탈퇴 버튼 */}
            <button
              onClick={handleDeleteAccount}
              style={{
                marginTop: "12px",
                background: "transparent",
                border: "none",
                color: "#b45a5a",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- 하위 공용 컴포넌트 ---------- */

// 입력 필드
function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <label
        style={{
          display: "block",
          fontSize: "14px",
          fontWeight: 500,
          color: "#B38252",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          maxWidth: "240px",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #D2B48C",
          outline: "none",
          background: "#FFF",
          fontSize: "14px",
          color: "#333",
          textAlign: "center",
        }}
      />
    </div>
  );
}

// 읽기 전용 이메일 표시 필드
function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <label
        style={{
          display: "block",
          fontSize: "14px",
          fontWeight: 500,
          color: "#B38252",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        readOnly
        style={{
          width: "100%",
          maxWidth: "240px",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #D2B48C",
          background: "#f7f7f7",
          color: "#888",
          fontSize: "14px",
          textAlign: "center",
        }}
      />
    </div>
  );
}
