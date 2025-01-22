import { mutate } from "swr";
import { getToken } from "../auth";

export function deleteAccountAPI(accountId, setError) {
  fetch(`http://127.0.0.1:8000/api/close-account/${accountId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    } 
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      mutate("http://127.0.0.1:8000/api/my-accounts");
    })
    .catch(error => setError(error));
}
