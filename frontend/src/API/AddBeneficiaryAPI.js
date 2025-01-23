import { mutate } from "swr";
import { getToken } from "../auth";

export function AddBeneficiaryAPI(account_id, iban) {
	fetch("http://127.0.0.1:8000/api/add-beneficiary", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		},
		body: JSON.stringify({ account_id, iban })
	})
		.then(res => res.json())
		.then(res => {
			console.log(res);
			mutate(`http://127.0.0.1:8000/api/my-beneficiaries/${account_id}`);
		});
}
