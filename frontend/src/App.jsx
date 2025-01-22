import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { SessionContextProvider } from "./sessionContext.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import Header from "./component/header.jsx";
import MyAccountsPage from "./pages/MyAccountsPage.jsx";


function App() {
	useEffect(() => {
		fetch("http://127.0.0.1:8000/api", {
			method: "GET"
		})
			.then(res => res.json())
			.then(res => console.log(res));
	}, []);

	return (
		<SessionContextProvider>
			<BrowserRouter>
				<nav>
					<Link to="/register">Register</Link>
					<Link to="/login">Login</Link>
					<Link to="/transactions">My transactions</Link>
				</nav>
				<Routes>
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/transactions/:account_id" element={<TransactionsPage />} />

				</Routes>
			</BrowserRouter>
		</SessionContextProvider>
	);
}

export default App;
