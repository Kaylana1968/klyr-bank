import { setToken } from "../auth";

export function RegisterAPI(email, password) {
	return fetch("http://127.0.0.1:8000/api/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ email, password })
	})
		.then(async (res) => {
			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.detail || "Une erreur est survenue.");
			}
			const token = await res.json();
			setToken(token);
		})
		.catch((error) => {
			// On propage l'erreur pour qu'elle soit gérée dans le composant
			throw error;
		});
}
