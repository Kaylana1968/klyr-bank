import { useParams } from "react-router";
import { useFormik } from "formik";
import { AddWithdrawalAPI } from "../API/AddWithdrawalAPI";

import { intervals } from "../constants/withdrawal";

export default function AddWithdrawal() {
	const { account_id } = useParams();

	const { values, handleChange, handleSubmit } = useFormik({
		initialValues: {
			iban: "",
			amount: 0,
			starting_on: "1990-01-01",
			interval: intervals[0]
		},
		onSubmit: ({ iban, amount, starting_on, interval }) =>
			AddWithdrawalAPI(account_id, iban, amount, starting_on, interval)
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

			<input
				type="number"
				name="amount"
				placeholder="Amount"
				value={values.amount}
				onChange={handleChange}
			/>

			<input
				type="text"
				name="starting_on"
				placeholder="Starting date"
				value={values.starting_on}
				onChange={handleChange}
			/>

			<select name="interval">
				{intervals.map(interval => (
					<option key={interval} value={interval}>
						{interval}
					</option>
				))}
			</select>

			<button type="submit">Ajouter</button>
		</form>
	);
}
