import { useState } from "react";
import { changePassword } from "../API/ChangePassword";
import { useFormik } from "formik";
import { logout } from "../auth";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

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

function Profil() {
	const [responseMessage, setResponseMessage] = useState(null);
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [password, setPassword] = useState("");
	const [new_password, setNewPassword] = useState("");
	const [confirm_new_password, setConfirmNewPassword] = useState("");

	const { values, errors, touched, handleChange, handleSubmit } = useFormik({
		initialValues: {
			password: "",
			new_password: "",
			confirm_new_password: ""
		},
		validate: ({ new_password, confirm_new_password }) => {
			const errors = {};
			if (!new_password) errors.new_password = "Password required";
			else if (new_password.length < 8)
				errors.new_password = "Password is too short (min 8 characters)";
			else if (
				!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].some(number =>
					new_password.includes(number)
				)
			)
				errors.new_password = "Password must include at least one number";
			else if (
				!["&", "#", "-", "_", "!", "?", "*", "@", ".", ":", ";"].some(char =>
					new_password.includes(char)
				)
			)
				errors.new_password =
					"Password must include at least one of &#-_!?*@.:;";
			else if (new_password != confirm_new_password)
				errors.new_password =
					"Password missmatch with the new confirm password";

			return errors;
		},
		onSubmit: async ({ password, new_password, confirm_new_password }) => {
			handleOpen();
			setPassword(password);
			setNewPassword(new_password);
			setConfirmNewPassword(confirm_new_password);
		}
	});

	const confirm_change_password = async () => {
		console.log(password, new_password, confirm_new_password);
		try {
			const response = await changePassword(
				password,
				new_password,
				confirm_new_password
			);
			console.log(response);
			setResponseMessage("Mot de passe changé avec succès !");
			logout();
		} catch (error) {
			setResponseMessage(error.message);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					type="password"
					name="password"
					placeholder="password"
					value={values.password}
					onChange={handleChange}
				/>
				<input
					type="new_password"
					name="new_password"
					placeholder="new password"
					value={values.new_password}
					onChange={handleChange}
				/>
				{errors.new_password && touched.new_password && (
					<span>{errors.new_password}</span>
				)}
				<input
					type="confirm_new_password"
					name="confirm_new_password"
					placeholder="confirm new password"
					value={values.confirm_new_password}
					onChange={handleChange}
				/>
				{errors.confirm_new_password && touched.confirm_new_password && (
					<span>{errors.new_password}</span>
				)}
				<button type="submit">Changer de mot de passe</button>
			</form>

			<button onClick={() => logout()}>Déconnexion</button>

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<h2 id="parent-modal-title">
						Etes vous sur de bien vouloir changer de mot de passe ?
					</h2>
					<div>
						<button onClick={confirm_change_password}>Oui</button>
						<button onClick={handleClose}>Non</button>
						<br />
						{responseMessage && <span>{responseMessage}</span>}
					</div>
				</Box>
			</Modal>
		</>
	);
}

export default Profil;
