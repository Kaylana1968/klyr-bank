import { Link } from "react-router";
import useSWR from "swr";
import { GETfetcher } from "../constants/fetcher";
import { Fragment, useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";

export default function MyAccounts() {
  const [deletingAccount, setDeletingAccount] = useState();

  const { data: accounts, isLoading } = useSWR(
    "http://127.0.0.1:8000/api/my-accounts",
    GETfetcher
  );

  console.log(accounts);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="p-6 max-h-[60vh] overflow-auto">
        {accounts &&
          accounts.map((account, index) => (
            <Fragment key={index}>
              {index === 0 && <hr className="border-primary my-3" />}
              <div className="flex justify-between items-center bg-white shadow-sm p-4 rounded-lg mb-4">
                <div>
                  <div className="text-primary font-bold text-lg">
                    {account.name}
                  </div>
                  <div className="text-gray-700">
                    Montant : {account.amount}
                  </div>
                  <div className="text-gray-700">IBAN : {account.iban}</div>
                </div>
                <div className="flex gap-4">
                  <Link
                    to={"/transactions/" + account.id}
                    className="text-primary underline hover:text-primary-dark"
                  >
                    Transactions
                  </Link>
                  <Link
                    to={"/beneficiaries/" + account.id}
                    className="text-primary underline hover:text-primary-dark"
                  >
                    Benefiaciaries
                  </Link>
                  <Link
                    to={"/withdrawals/" + account.id}
                    className="text-primary underline hover:text-primary-dark"
                  >
                    Withdrawals
                  </Link>
                </div>
                {!account.is_main && (
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 font-semibold"
                    onClick={() => setDeletingAccount(account)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <hr className="border-primary my-3" />
            </Fragment>
          ))}
      </div>

      <DeleteAccountModal
        deletingAccount={deletingAccount}
        setDeletingAccount={setDeletingAccount}
      />
    </>
  );
}
