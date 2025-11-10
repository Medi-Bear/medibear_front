import { Outlet } from "react-router-dom"
import Header from "../components/pageComponents/Header"


const MainLayout = () => {
	return (
		<Header>
			<main className="min-h-screen">
				<Outlet/>
			</main>
		</Header>
	)
}

export default MainLayout
