import { useFormik } from "formik";
import { RegisterAPI } from "../API/RegisterAPI";
import { useState } from "react";

function Register() {
	const [responseMessage, setResponseMessage] = useState(null);

  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
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
        !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].some((number) =>
          password.includes(number)
        )
      )
        errors.password = "Password must include at least one number";
      else if (
        !["&", "#", "-", "_", "!", "?", "*", "@", ".", ":", ";"].some((char) =>
          password.includes(char)
        )
      )
        errors.password = "Password must include at least one of &#-_!?*@.:;";

      return errors;
    },
    onSubmit: async ({ email, password }) => {
      try {
        const response = await RegisterAPI(email, password);
		setResponseMessage("Compte créé avec succès !", response);
      } catch (error){
		setResponseMessage(error.message); 
	  }
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          name="email"
          type="email"
          placeholder="email"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && touched.email && <span>{errors.email}</span>}
        <input
          name="password"
          type="password"
          placeholder="password"
          value={values.password}
          onChange={handleChange}
        />
        {errors.password && touched.password && <span>{errors.password}</span>}

        <button type="submit">créer un compte</button>
      </form>

      {responseMessage && <span>{responseMessage}</span>}
    </>
  );
}

export default Register;
