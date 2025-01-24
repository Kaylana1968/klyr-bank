import AddWithdrawal from "../component/AddWithdrawal";
import Withdrawals from "../component/Withdrawals";

export default function WithdrawalPage() {
	return (
		<div className="w-full p-8">
			<Withdrawals />
			<AddWithdrawal />
		</div>
	);
}
