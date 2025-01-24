import Transactions from "../component/Transactions";
import Accountpdf from "../component/Accountpdf";

function TransactionsPage() {
	return (
		<div className="w-full">
			<Transactions />
			<Accountpdf />
		</div>
	);
}

export default TransactionsPage;
