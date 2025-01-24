import { getToken } from "../auth";

export default function CancelTransactionAPI(transactionId) {
	fetch(`http://127.0.0.1:8000/api/cancel-transaction/${transactionId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		}
	})
		.then(res => res.json())
		.then(res => {
			console.log(res);
		});
}
