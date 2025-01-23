import { mutate } from "swr";
import { getToken } from "../auth";

export function deleteAccountAPI(
	accountId,
	password,
	setDeletingAccount,
	setError
) {
	fetch(`http://127.0.0.1:8000/api/close-account/${accountId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		},
		body: JSON.stringify({ password })
	})
		.then(async res => {
			if (!res.ok) {
				const error = await res.json();
				throw Error(error.detail || "Failed to delete password");
			} else {
				setDeletingAccount();
				mutate("http://127.0.0.1:8000/api/my-accounts");
			}
		})
		.catch(error => setError(error.message));
}
