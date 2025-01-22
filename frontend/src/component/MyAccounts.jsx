import { useEffect, useState } from "react";
import MyAccountsAPI from "../API/MyAccountsAPI";
import { Link } from "react-router";
import { deleteAccountAPI } from "../API/DeleteAccountAPI";

export default function MyAccounts() {
	const [accounts, setAccounts] = useState();

	useEffect(() => {
		MyAccountsAPI(setAccounts);
	}, []);

	return (
		<div>
			{accounts &&
				accounts.map((account, index) => (
					<>
						{index === 0 && <hr className="my-3" />}
						<div className="flex justify-between">
							<Link key={account.iban}>
								<div>{account.name}</div>
								<div>{account.amount}</div>
								<div>{account.iban}</div>
							</Link>

							<button
								type="button"
								className="text-red-500"
								onDoubleClick={() => deleteAccountAPI(account.id)}
							>
								Delete
							</button>
						</div>
						<hr className="my-3" />
					</>
				))}
		</div>
	);
}
