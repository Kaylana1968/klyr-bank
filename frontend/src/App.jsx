import {BrowserRouter, Routes, Route, Link} from "react-router"
import RegisterPage from "./pages/RegisterPage";
import React, {useEffect} from "react";
import LoginPage from "./pages/LoginPage";

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
				<Link to="/login">Login</Link>
			</nav>
			<Routes>
				<Route path="/register" element={<RegisterPage/>} />
				<Route path="/login" element={<LoginPage/>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App
