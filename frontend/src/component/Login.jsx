import { useState } from "react";
import { LoginAPI } from "../API/LoginAPI";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function handleSubmit(e) {
		e.preventDefault();
		LoginAPI(email, password);
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				value={email}
				onChange={({ target }) => setEmail(target.value)}
			/>
			<input
				type="password"
				value={password}
				onChange={({ target }) => setPassword(target.value)}
			/>
			<button type="submit">Se connecter</button>
		</form>
	);
}

export default Login;
