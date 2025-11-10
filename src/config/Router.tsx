
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import { Counter } from "../pages/Counter";
import Mypage from "../pages/Mypage";
import Calorie from "../pages/Calorie";
import Login from "../pages/member/Login";
import Register from "../pages/member/Register";

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout/>}>
					<Route path="/" element={<Home/>}/>
					<Route path="calorie" element={<Calorie/>}/>
					<Route path="counter" element={<Counter/>}/>
					<Route path="mypage" element={<Mypage/>}/>
				</Route>
				<Route>
				<Route path="/login" element={<Login/>}/>
				<Route path="/register" element={<Register/>}/>
				</Route>

			</Routes>
		</BrowserRouter>
	)
}
export default Router;