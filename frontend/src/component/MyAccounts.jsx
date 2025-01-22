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
				accounts.map((account, index) => (
					<>
						{index === 0 && <hr className="my-3" />}
						<Link key={account.iban}>
							<div>{account.name}</div>
							<div>{account.amount}</div>
							<div>{account.iban}</div>
						</Link>
						<hr className="my-3" />
					</>
				))}
		</div>
	);
}
