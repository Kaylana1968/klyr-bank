import { setToken } from "../auth";

export async function RegisterAPI(email, password, setContextToken) {
	return fetch("http://127.0.0.1:8000/api/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ email, password })
	})
		.then(async res => {
			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.detail || "Une erreur est survenue.");
			}
			const token = await res.json();
			setToken(token);
			setContextToken(token)
		})
		.catch(error => {
			throw error;
		});
}
