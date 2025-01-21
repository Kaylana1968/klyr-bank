import {BrowserRouter, Routes, Route, Link} from "react-router"
import RegisterPage from "./pages/RegisterPage";
import React, {useEffect} from "react";

function App() {
	useEffect(() => {
		fetch("http://127.0.0.1:8000/api", {
			method: "GET"
		})
			.then(res => res.json())
			.then(res => console.log(res));
	}, []);

	return (
		<BrowserRouter>
			<nav>
				<Link to="/register">Register</Link>
			</nav>
			<Routes>
				<Route path="/register" element={<RegisterPage/>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App
