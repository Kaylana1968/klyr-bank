import AddBeneficiary from "../component/AddBeneficiary";
import Beneficiaries from "../component/Beneficiaries";

export default function BeneficiariesPage() {
	return (
		<div className="w-full p-8">
			<Beneficiaries />
			<AddBeneficiary />
		</div>
	);
}
