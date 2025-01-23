import { useParams } from "react-router";
import { useFormik } from "formik";
import { AddBeneficiaryAPI } from "../API/AddBeneficiaryAPI";

export default function AddBeneficiary() {
	const { account_id } = useParams();

	const { values, handleChange, handleSubmit } = useFormik({
		initialValues: {
			iban: ""
		},
		onSubmit: ({ iban }) => AddBeneficiaryAPI(account_id, iban)
	});

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				name="iban"
				placeholder="IBAN"
				value={values.iban}
				onChange={handleChange}
			/>

      <button type="submit">Ajouter</button>
		</form>
	);
}
