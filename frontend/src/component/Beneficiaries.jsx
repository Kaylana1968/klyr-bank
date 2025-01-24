import useSWR from "swr";
import { GETfetcher } from "../constants/fetcher";
import { Fragment } from "react";
import { useParams } from "react-router";

export default function Beneficiaries() {
  const { account_id } = useParams();

  const { data: beneficiaries, isLoading } = useSWR(
    `http://127.0.0.1:8000/api/my-beneficiaries/${account_id}`,
    GETfetcher
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 shadow-md rounded-lg max-w-lg mx-auto mb-8">
      {beneficiaries && beneficiaries.length > 0 ? (
        beneficiaries.map((beneficiary, index) => (
          <Fragment key={index}>
            {index === 0 && <hr className="my-4 border-secondary" />}
            <div className="flex justify-between items-center py-2">
              <span className="text-primary font-medium">
                {beneficiary.iban}
              </span>
            </div>
            <hr className="my-4 border-secondary" />
          </Fragment>
        ))
      ) : (
        <p className="text-gray-500 text-center">Aucun bénéficiaire trouvé.</p>
      )}
    </div>
  );
}
