import { useContext } from "react";
import Login from "../component/Login";
import { SessionContext } from "../sessionContext";

function LoginPage() {
	const { token } = useContext(SessionContext);
	console.log(token);

	return (
		<>
			<Login />
		</>
	);
}

export default LoginPage;
