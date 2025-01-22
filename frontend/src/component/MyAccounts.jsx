import { Link } from "react-router";
import { deleteAccountAPI } from "../API/DeleteAccountAPI";
import useSWR from "swr";
import { GETfetcher } from "../constants/fetcher";
import { Fragment, useState } from "react";

export default function MyAccounts() {
    const [error, setError] = useState('');
    
  const { data: accounts, isLoading} = useSWR(
    "http://127.0.0.1:8000/api/my-accounts",
    GETfetcher
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {accounts &&
        accounts.map((account, index) => (
          <Fragment key={account.iban}>
            {index === 0 && <hr className="my-3" />}
            <div className="flex justify-between">
              <Link>
                <div>{account.name}</div>
                <div>{account.amount}</div>
                <div>{account.iban}</div>
              </Link>

              {!account.is_main && (
                <button
                  type="button"
                  className="text-red-500"
                  onDoubleClick={() => deleteAccountAPI(account.id , setError)}
                >
                  Delete
                </button>
              )}
            </div>
            {error && <span className="text-red-700">{error}</span>}
            <hr className="my-3" />
          </Fragment>
        ))}
    </div>
  );
}
