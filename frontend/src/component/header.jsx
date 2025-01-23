import { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { SessionContext } from "../sessionContext";

export default function Header() {
	const { token } = useContext(SessionContext);

	const navigate = useNavigate();
	const { pathname } = useLocation();

	useEffect(() => {
		if (pathname !== "/login" && pathname !== "/register" && !token)
			navigate("/login");
	}, [pathname, navigate, token]);

	return (
		<nav className="flex gap-2">
			<Link to="/register">Register</Link>
			<Link to="/login">Login</Link>

			{token && (
				<>
					<Link to="/my-accounts">My accounts</Link>
				</>
			)}
		</nav>
	);
}
