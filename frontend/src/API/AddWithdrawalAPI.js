import { mutate } from "swr";
import { getToken } from "../auth";

export function AddWithdrawalAPI(
	account_id,
	iban,
	amount,
	starting_on,
	interval
) {
	fetch("http://127.0.0.1:8000/api/add-withdrawal", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		},
		body: JSON.stringify({ account_id, iban, amount, starting_on, interval })
	})
		.then(res => res.json())
		.then(res => {
			console.log(res);
			mutate(`http://127.0.0.1:8000/api/my-withdrawals/${account_id}`);
		});
}
