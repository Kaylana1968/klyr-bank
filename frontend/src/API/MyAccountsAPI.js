import { getToken } from "../auth";

export default function MyAccountsAPI(setAccounts) {
  fetch("http://127.0.0.1:8000/api/my-accounts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => setAccounts(res));
}
