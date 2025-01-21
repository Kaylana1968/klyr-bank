import { setToken } from "../auth";

export function RegisterAPI(email, password) {
	fetch("http://127.0.0.1:8000/api/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ email, password })
	})
		.then(res => res.json())
		.then(token => setToken(token));
}
