import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { SessionContextProvider } from "./sessionContext.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import Header from "./component/header.jsx";
import MyAccountsPage from "./pages/MyAccountsPage.jsx";

import ProfilPage from "./pages/ProfilPage.jsx";

import BeneficiariesPage from "./pages/BeneficiariesPage.jsx";
import WithdrawalPage from "./pages/WithdrawalPage.jsx";

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
				<Header />

				<Routes>
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/my-accounts" element={<MyAccountsPage />} />

					<Route path="/profilpage" element={<ProfilPage />} />

					<Route
						path="/transactions/:account_id"
						element={<TransactionsPage />}
					/>
					<Route
						path="/beneficiaries/:account_id"
						element={<BeneficiariesPage />}
					/>
					<Route path="/withdrawals/:account_id" element={<WithdrawalPage />} />
				</Routes>
			</BrowserRouter>
		</SessionContextProvider>
	);
}

export default App;
