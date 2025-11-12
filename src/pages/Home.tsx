import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "../redux/slice/counterSlice";
import type { AppDispatch, RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import InputBar from "../components/InputBar/InputBar";


const Home = () => {
  const navigate = useNavigate();
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();


  const handleSend = (data: any) => console.log("운동 데이터:", data);

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-[#FFFCF6]">
      <h1 className="text-3xl font-bold underline mb-6 text-center">
        Tailwind CSS 테스트
      </h1>

      <div className="text-center my-8">
        <h2 className="text-lg font-semibold mb-2">Redux Persist Example</h2>
        <h3 className="text-2xl mb-4">{count}</h3>
        <button
          onClick={() => dispatch(increment())}
          className="btn btn-primary mx-2"
        >
          +1
        </button>
        <button
          onClick={() => dispatch(decrement())}
          className="btn btn-secondary mx-2"
        >
          -1
        </button>
      </div>

      <div className="bg-blue-300 text-white font-semibold mt-10 p-6 rounded-xl w-full max-w-[1200px] mx-auto flex flex-col items-center">
        <p>화면 너비를 벗어나지 않는 가로 박스</p>
        <button
          className="btn btn-neutral mt-3"
          onClick={() => navigate("login")}
        >
          로그인
        </button>
      </div>

      {/* stress InputBar 테스트 영역 */}
      <div className="mt-10 w-full max-w-[1027px]">
        <h2 className="text-xl font-bold mb-3 text-center text-gray-700">
          Exercise Input 테스트
        </h2>
		<InputBar variant="exercise" onSend={handleSend}/>
      </div>
	  <div className="mt-10 w-full max-w-[1027px]">
        <h2 className="text-xl font-bold mb-3 text-center text-gray-700">
          스트레스 관리 Input 테스트
        </h2>
		<InputBar variant="stress" onSend={handleSend}/>
      </div>
    </div>
  );
};

export default Home;
