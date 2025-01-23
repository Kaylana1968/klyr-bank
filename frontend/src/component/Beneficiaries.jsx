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
		<div>
			{beneficiaries &&
				beneficiaries.map((beneficiary, index) => (
					<Fragment key={index}>
						{index === 0 && <hr className="my-3" />}
						
            <div>{beneficiary.iban}</div>
            
						<hr className="my-3" />
					</Fragment>
				))}
		</div>
	);
}
