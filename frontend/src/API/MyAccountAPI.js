import { getToken } from "../auth";

export async function MyAccountAPI(account_id) {
  const token = getToken();

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/account/${account_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Une erreur est survenue.");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
