import { useFormik } from "formik";
import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { deleteAccountAPI } from "../API/DeleteAccountAPI";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4
};

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
			deleteAccountAPI(
				deletingAccount.id,
				password,
				setDeletingAccount,
				setError
			);
			resetForm();
		}
	});

	return (
		<Modal
			open={deletingAccount}
			onClose={() => {
				resetForm();
				setDeletingAccount();
			}}
		>
			<Box sx={style}>
				<h2 id="parent-modal-title">Enter your password to confirm</h2>
				<form onSubmit={handleSubmit} className="flex flex-col items-start">
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
			</Box>
		</Modal>
	);
}
