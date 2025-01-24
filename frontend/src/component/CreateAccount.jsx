import { useFormik } from "formik";
import InputField from "./ui/InputField";
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
        className="bg-white outline-none border-2 border-secondary-dark rounded py-1 px-2 focus:border-primary transition-colors duration-300s ease w-full"
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
        className="outline-none border-2 border-secondary-dark rounded py-1 px-2 focus:border-primary transition-colors duration-300s ease w-full"
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
