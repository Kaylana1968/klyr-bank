import { mutate } from "swr";
import { getToken } from "../auth";

export async function CreateTransactionAPI(sender, receiver, amount) {
	return fetch("http://127.0.0.1:8000/api/transaction", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		},
		body: JSON.stringify({
			sender_account_id: sender,
			receiver_account_id: receiver,
			amount: amount
		})
	})
		.then(async res => {
			if (res.ok) {
				return res.json();
			} else {
				const errorData = await res.json();
				throw new Error(errorData.detail || "Erreur inconnue du serveur");
			}
		})
		.then(res => {
			mutate("http://127.0.0.1:8000/api/transaction");

			return res;
		})
		.catch(error => {
			console.error("Erreur dans le catch:", error.message);
			throw error;
		});
}
