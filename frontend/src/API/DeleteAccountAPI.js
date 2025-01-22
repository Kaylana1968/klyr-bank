import { getToken } from "../auth";

export function deleteAccountAPI(accountId) {
  fetch(`http://127.0.0.1:8000/api/close-account/${accountId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    } 
  })
    .then(res => res.json())
    .then(res => console.log(res));
}
