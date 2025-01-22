import { useFormik } from "formik";

import { LoginAPI } from "../API/LoginAPI";

function Login() {
	const { values, handleChange, handleSubmit } = useFormik({
		initialValues: {
			email: "",
			password: ""
		},
		onSubmit: ({ email, password }) => LoginAPI(email, password)
	});

	return (
		<form onSubmit={handleSubmit}>
			<input
				name="email"
				type="email"
				value={values.email}
				onChange={handleChange}
			/>
			<input
				name="password"
				type="password"
				value={values.password}
				onChange={handleChange}
			/>

			<button type="submit">Se connecter</button>
		</form>
	);
}

export default Login;
