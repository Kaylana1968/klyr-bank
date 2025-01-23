import { useFormik } from "formik";

import { accountTypes } from "../constants/account";
import { CreateAccountAPI } from "../API/CreateAccountAPI";

export default function CreateAccount() {
	const { values, handleChange, handleSubmit } = useFormik({
		initialValues: {
			type: accountTypes[0],
			name: ""
		},
		onSubmit: ({ name, type }) => CreateAccountAPI(name, type)
	});

	return (
		<form onSubmit={handleSubmit} className="flex flex-col items-start gap-2">
			<select name="type" onChange={handleChange} className="px-2 py-1">
				{accountTypes.map(type => (
					<option key={type} value={type}>
						{type}
					</option>
				))}
			</select>

			<input
				type="text"
				name="name"
				placeholder="Nom du compte"
				value={values.name}
				onChange={handleChange}
			/>

			<button type="submit">Create account</button>
		</form>
	);
}
