import { useParams } from "react-router";
import { useFormik } from "formik";
import { AddBeneficiaryAPI } from "../API/AddBeneficiaryAPI";
import InputField from "./ui/InputField";

export default function AddBeneficiary() {
  const { account_id } = useParams();

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      iban: "",
    },
    onSubmit: ({ iban }) => AddBeneficiaryAPI(account_id, iban),
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-6 shadow-md rounded-lg max-w-sm mx-auto"
    >
      <InputField
        type="text"
        name="iban"
        placeholder="IBAN"
        value={values.iban}
        onChange={handleChange}
        className="w-full border border-primary rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <button
        type="submit"
        className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark transition duration-300 w-full"
      >
        Ajouter
      </button>
    </form>
  );
}
