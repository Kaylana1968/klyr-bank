import { useFormik } from "formik";
import { RegisterAPI } from "../API/RegisterAPI";

function Register() {
	const { values, handleChange, handleSubmit } = useFormik({
		initialValues: {
			email: "",
			password: ""
		},
		onSubmit: ({ email, password }) => RegisterAPI(email, password)
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

			<button type="submit">créer un compte</button>
		</form>
	);
}

export default Register;
