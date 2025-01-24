import { useFormik } from "formik";
import { RegisterAPI } from "../API/RegisterAPI";
import { useContext, useState } from "react";
import Card from "@mui/material/Card";
import logo_klyr_bank from "../component/pictures/klyrbank.png";
import AuthContext from "../auth.context";

function Register() {
	const { setToken } = useContext(AuthContext);
	const [responseMessage, setResponseMessage] = useState(null);

	const { values, errors, touched, handleChange, handleSubmit } = useFormik({
		initialValues: {
			email: "",
			password: ""
		},
		validate: ({ email, password }) => {
			const errors = {};

			if (!email) errors.email = "Email required";
			else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
				errors.email = "Invalid email";

			if (!password) errors.password = "Password required";
			else if (password.length < 8)
				errors.password = "Password is too short (min 8 characters)";
			else if (
				!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].some(number =>
					password.includes(number)
				)
			)
				errors.password = "Password must include at least one number";
			else if (
				!["&", "#", "-", "_", "!", "?", "*", "@", ".", ":", ";"].some(char =>
					password.includes(char)
				)
			)
				errors.password = "Password must include at least one of &#-_!?*@.:;";

			return errors;
		},
		onSubmit: async ({ email, password }) => {
			try {
				const response = await RegisterAPI(email, password, setToken);
				setResponseMessage("Compte créé avec succès !", response);
			} catch (error) {
				setResponseMessage(error.message);
			}
		}
	});

	return (
		<div className="flex flex-col justify-center items-center h-screen w-full bg-gray-50">
			<img
				src={logo_klyr_bank}
				alt="Logo Klyr Bank"
				className="w-48 h-auto mb-6"
			/>
			<Card className="p-6 w-full max-w-md bg-white shadow-lg rounded-lg">
				<h2 className="text-center text-primary font-bold text-2xl mb-3">
					Créer un compte
				</h2>
				<h1 className="text-center text-sm mb-6">
					Vous avez déjà un compte ?{" "}
					<button
						onClick={() => (window.location.href = "/login")}
						className="text-primary hover:underline"
					>
						Connexion
					</button>
				</h1>
				<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-primary mb-1"
						>
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="Entrez votre email"
							value={values.email}
							onChange={handleChange}
							className="w-full p-3 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
						{errors.email && touched.email && (
							<span className="text-red-500 text-sm">{errors.email}</span>
						)}
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-primary mb-1"
						>
							Mot de passe
						</label>
						<input
							id="password"
							name="password"
							type="password"
							placeholder="Entrez votre mot de passe"
							value={values.password}
							onChange={handleChange}
							className="w-full p-3 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
						{errors.password && touched.password && (
							<span className="text-red-500 text-sm">{errors.password}</span>
						)}
					</div>
					<button
						type="submit"
						style={{ color: "white" }}
						className="p-3 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition"
					>
						Créer un compte
					</button>
				</form>
				{responseMessage && (
					<span className="block mt-4 text-green-500 text-center">
						{responseMessage}
					</span>
				)}
			</Card>
		</div>
	);
}

export default Register;
