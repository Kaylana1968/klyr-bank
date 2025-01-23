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

	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			<div>
				{accounts &&
					accounts.map((account, index) => (
						<Fragment key={account.iban}>
							{index === 0 && <hr className="my-3" />}
							<div className="flex justify-between">
								<Link to={"/transactions/" + account.id}>
									<div>{account.name}</div>
									<div>{account.amount}</div>
									<div>{account.iban}</div>
								</Link>

								{!account.is_main && (
									<button
										type="button"
										className="text-red-500"
										onClick={() => setDeletingAccount(account)}
									>
										Delete
									</button>
								)}
							</div>
							<hr className="my-3" />
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
