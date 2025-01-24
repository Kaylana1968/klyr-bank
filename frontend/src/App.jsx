import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import Sidebar from "./component/Sidebar.jsx";
import MyAccountsPage from "./pages/MyAccountsPage.jsx";
import VirementPage from "./pages/VirementPage.jsx";

import ProfilPage from "./pages/ProfilPage.jsx";

import BeneficiariesPage from "./pages/BeneficiariesPage.jsx";
import WithdrawalPage from "./pages/WithdrawalPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

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
				<Sidebar />

				<Routes>
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/my-accounts" element={<MyAccountsPage />} />

					<Route path="/profile" element={<ProfilPage />} />

					<Route
						path="/transactions/:account_id"
						element={<TransactionsPage />}
					/>
					<Route
						path="/beneficiaries/:account_id"
						element={<BeneficiariesPage />}
					/>
					<Route path="/virement" element={<VirementPage />} />
					<Route path="/withdrawals/:account_id" element={<WithdrawalPage />} />
					<Route path="/dashboard" element={<DashboardPage />} />
				</Routes>
			</BrowserRouter>
	);
}

export default App;
