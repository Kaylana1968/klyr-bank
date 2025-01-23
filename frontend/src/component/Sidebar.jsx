import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { getToken } from "../auth";

export default function Sidebar() {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const token = getToken();

	useEffect(() => {
		if (pathname !== "/login" && pathname !== "/register" && !token)
			navigate("/login");
	}, [pathname, navigate, token]);

	return (
		<nav className="flex flex-col h-screen w-40 bg-secondary text-primary gap-5 p-3">
			<Link to="/register">Register</Link>
			<Link to="/login">Login</Link>

			{token && (
				<>
					<Link to="/my-accounts">My accounts</Link>
					<Link to="/virement">Virement</Link>
					<Link to="/profile">Profile</Link>
				</>
			)}
		</nav>
	);
}
