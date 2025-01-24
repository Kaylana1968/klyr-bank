import { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import AuthContext from "../auth.context";

export default function Sidebar() {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const { token } = useContext(AuthContext);

	useEffect(() => {
		if (pathname !== "/login" && pathname !== "/register" && !token)
			navigate("/login");
	}, [pathname, navigate, token]);

	return (
		<aside className="h-screen min-w-40 bg-secondary text-primary flex flex-col items-center">
			<h1 className="text-center text-xl font-bold py-5">KLYR Bank</h1>
			<hr className="w-2/3 border-primary" />
			<nav className="flex flex-col h-screen w-full gap- py-5">
				{!token && (
					<div className="flex flex-col h-screen w-full">
						<Link
							to="/register"
							className="py-2 px-6 hover:bg-secondary-dark hover:text-white transition-colors duration-300s ease"
						>
							Register
						</Link>
						<Link
							to="/login"
							className="py-2 px-6 hover:bg-secondary-dark hover:text-white transition-colors duration-300s ease"
						>
							Login
						</Link>
					</div>
				)}

				{token && (
					<>
						<Link
							to="/my-accounts"
							className="py-2 px-6 hover:bg-secondary-dark hover:text-white transition-colors duration-300s ease"
						>
							My accounts
						</Link>
						<Link
							to="/virement"
							className="py-2 px-6 hover:bg-secondary-dark hover:text-white transition-colors duration-300s ease"
						>
							Virement
						</Link>
						<Link
							to="/profile"
							className="py-2 px-6 hover:bg-secondary-dark hover:text-white transition-colors duration-300s ease"
						>
							Profile
						</Link>
						<Link
							to="/dashboard"
							className="py-2 px-6 hover:bg-secondary-dark hover:text-white transition-colors duration-300s ease"
						>
							Dashboard
						</Link>
						
					</>
				)}
			</nav>
		</aside>
	);
}
