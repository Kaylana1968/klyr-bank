import { getToken } from "../auth";

export function changePassword(password, new_password, confirm_new_password) {
	return fetch(`http://127.0.0.1:8000/api/change-password`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		},
		body: JSON.stringify({ password, new_password, confirm_new_password })
	})
		.then(async res => {
			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.detail || "Une erreur est survenue.");
			}
			return res.json();
		})
		.catch(error => {
			throw error;
		});
}
