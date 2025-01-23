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
		<div>
			{withdrawals &&
				withdrawals.map((withdrawal, index) => (
					<Fragment key={index}>
						{index === 0 && <hr className="my-3" />}

						{withdrawal.amount}

						<hr className="my-3" />
					</Fragment>
				))}
		</div>
	);
}
