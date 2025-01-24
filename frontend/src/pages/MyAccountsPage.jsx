import CreateAccount from "../component/CreateAccount";
import MyAccounts from "../component/MyAccounts";

export default function MyAccountsPage() {
	return (
		<div className="w-full flex-col flex">
			<MyAccounts />
			<CreateAccount />
		</div>
	);
}
