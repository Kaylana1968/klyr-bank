import { useFormik } from "formik";

import { accountTypes } from "../constants/account";
import { CreateAccountAPI } from "../API/CreateAccountAPI";

export default function CreateAccount() {
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      type: accountTypes[0],
      name: "",
    },
    onSubmit: ({ name, type }) => CreateAccountAPI(name, type),
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start gap-4 bg-white p-6 shadow-md rounded-lg max-w-md m-auto w-3/5"
    >
      <select
        name="type"
        onChange={handleChange}
        className="w-full border border-primary rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {accountTypes.map((type) => (
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
        className="w-full border border-primary rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <button
        type="submit"
        className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark transition duration-300 w-full"
      >
        Create account
      </button>
    </form>
  );
}
