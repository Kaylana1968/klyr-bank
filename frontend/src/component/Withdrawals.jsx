import useSWR from "swr";
import { GETfetcher } from "../constants/fetcher";
import { Fragment } from "react";
import { useParams } from "react-router";

export default function Withdrawals() {
  const { account_id } = useParams();

  const { data: withdrawals, isLoading } = useSWR(
    `http://127.0.0.1:8000/api/my-withdrawals/${account_id}`,
    GETfetcher
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 shadow-md rounded-lg max-w-lg mx-auto mb-8">
      {withdrawals &&
        withdrawals.map((withdrawal, index) => (
          <Fragment key={index}>
            {index === 0 && <hr className="my-4 border-secondary" />}
            <div className="flex justify-between items-center py-3">
              <span className="text-primary font-semibold">
                Montant : {withdrawal.amount}
              </span>
            </div>
            <hr className="my-4 border-secondary" />
          </Fragment>
        ))}
    </div>
  );
}
