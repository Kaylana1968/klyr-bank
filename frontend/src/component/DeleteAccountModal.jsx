import { useFormik } from "formik";
import { deleteAccountAPI } from "../API/DeleteAccountAPI";
import { useState } from "react";

export default function DeleteAccountModal({
	deletingAccount,
	setDeletingAccount
}) {
	const [error, setError] = useState("");

	const { values, handleChange, handleSubmit, resetForm } = useFormik({
		initialValues: {
			password: ""
		},
		onSubmit: ({ password }, { resetForm }) => {
			deleteAccountAPI(deletingAccount.id, password, setDeletingAccount, setError);
			resetForm();
		}
	});

	return (
		<div
			className={`${
				deletingAccount ? "" : "hidden "
			}absolute top-0 z-10 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center`}
		>
			<div className="w-2/5 h-1/4 bg-gray-200 rounded p-4">
				<button
					type="button"
					onClick={() => {
						setDeletingAccount();
						resetForm();
					}}
				>
					Cancel
				</button>

				<form onSubmit={handleSubmit} className="flex flex-col items-start">
					<label>Enter your password to confirm :</label>
					<input
						type="password"
						name="password"
						value={values.password}
						onChange={handleChange}
						autoComplete="off"
					/>
					<button type="submit" className="text-red-700">
						Supprimer
					</button>
				</form>

				{error && <span className="text-red-700">{error}</span>}
			</div>
		</div>
	);
}
