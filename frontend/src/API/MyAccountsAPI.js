import { getToken } from "../auth";

export function MyAccountsAPI() {
	return fetch("http://127.0.0.1:8000/api/my-accounts", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		}
	}).then(res => res.json());
}

export function GetAccountByIban(iban) {
	return fetch(`http://localhost:8000/api/account/iban/${iban}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		}
	}).then(res => {
		if (res.ok) {
			return res.json();
		} else {
			throw Error("Iban no match with account");
		}
	});
}
