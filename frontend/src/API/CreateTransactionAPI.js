import { mutate } from "swr";
import { getToken } from "../auth";

export function CreateTransactionAPI(sender, receiver, amount) {
  console.log("sender:", sender)
  console.log("receiver:", receiver)
  console.log("amount:", amount)
    return fetch("http://127.0.0.1:8000/api/transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
        "sender_account_id": sender,
        "receiver_account_id": receiver,
        "amount": amount
    }),
    })
    .then(async (res) => {
      if (res.ok) {
        console.log("Réponse ok:", res);
        return res.json();
      } else {
        const errorData = await res.json();
        console.error("Erreur API:", errorData);
        throw new Error(errorData.detail || "Erreur inconnue du serveur");
      }
    })
    .then(() => {
      mutate("http://127.0.0.1:8000/api/transaction");
    })
    .catch((error) => {
      console.error("Erreur dans le catch:", error.message);
      throw error;
    });

}
