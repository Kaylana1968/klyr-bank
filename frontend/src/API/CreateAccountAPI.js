import { mutate } from "swr";
import { getToken } from "../auth";

export function CreateAccountAPI(name, type) {
	fetch("http://127.0.0.1:8000/api/open-account", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		},
		body: JSON.stringify({ name, type })
	})
		.then(res => res.json())
		.then(res => {
			console.log(res);
			mutate("http://127.0.0.1:8000/api/my-accounts");
		});
}
