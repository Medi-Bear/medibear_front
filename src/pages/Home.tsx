import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLogo from "../assets/mainlogo.png"; // ⬅ import 방식 적용

const Home = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 50);
  }, []);

  return (
    <div
      className={`
        min-h-screen w-full 
        bg-gradient-to-b from-[#FFFDF8] to-[#FAF3E0] 
        flex flex-col items-center px-6 
        transition-opacity duration-1000
        ${fadeIn ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* ======================= HERO 영역 ======================= */}
      <section className="flex flex-col items-center mt-16 text-center max-w-[700px] w-full px-4">

        {/* 곰 마스코트 */}
        <div className="w-40 h-40 rounded-full bg-white shadow-2xl flex items-center justify-center mb-6 overflow-hidden">
          <img
            src={MainLogo}
            alt="Medibear Mascot"
            className="w-28 h-28 object-contain"
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#B38252] mb-4 leading-tight">
          Medibear Wellness Platform
        </h1>

        <p className="text-gray-700 text-base md:text-lg">
          AI 기반 수면 · 운동 · 스트레스 코칭을 제공하는 차세대 헬스케어 서비스
        </p>
      </section>

      {/* ======================= 버튼 ======================= */}
      <div className="flex flex-col items-center mt-10 gap-5">

        <button
          onClick={() => navigate("/login")}
          className="btn btn-lg w-56 bg-[#B38252] border-none text-white shadow-lg hover:bg-[#9a6d43] transition-all duration-300"
        >
          로그인
        </button>

        <button
          onClick={() => navigate("/register")}
          className="btn btn-lg w-56 border-[#B38252] text-[#B38252] bg-white hover:bg-[#FAF3E0] shadow-md transition-all duration-300"
        >
          회원가입
        </button>

      </div>

      {/* ======================= FOOTER ======================= */}
      <footer className="w-full mt-20 py-6 text-center text-gray-500 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} Medibear · AI Health & Wellness Platform
      </footer>
    </div>
  );
};

export default Home;
