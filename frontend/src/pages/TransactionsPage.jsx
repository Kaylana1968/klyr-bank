import Transactions from "../component/Transactions";
import Accountpdf from "../component/Accountpdf";

function TransactionsPage() {
	return (
		<div className="w-full flex-col flex">
			<Transactions />
			<Accountpdf />
		</div>
	);
}

export default TransactionsPage;
