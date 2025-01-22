import { useEffect, useState } from "react";
import MyAccountsAPI from "../API/MyAccountsAPI";
import { Link } from "react-router";

export default function MyAccounts() {
  const [accounts, setAccounts] = useState();

  useEffect(() => {
    MyAccountsAPI(setAccounts);
  }, []);

  return (
    <div>
      {accounts &&
        accounts.map((account) => (
          <Link key={account.iban}>
            <div>{account.name}</div>
            <div>{account.amount}</div>
            <div>{account.iban}</div>
          </Link>
        ))}
    </div>
  );
}
