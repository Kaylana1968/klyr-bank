import { useParams } from "react-router";
import { useFormik } from "formik";
import { AddWithdrawalAPI } from "../API/AddWithdrawalAPI";
import InputField from "./ui/InputField";
import SelectField from "./ui/SelectField";
import { intervals } from "../constants/withdrawal";

export default function AddWithdrawal() {
  const { account_id } = useParams();

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      iban: "",
      amount: 0,
      starting_on: "1990-01-01",
      interval: intervals[0],
    },
    onSubmit: ({ iban, amount, starting_on, interval }) =>
      AddWithdrawalAPI(account_id, iban, amount, starting_on, interval),
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-6 shadow-md rounded-lg max-w-lg mx-auto"
    >
      <InputField
        type="text"
        name="iban"
        placeholder="IBAN"
        value={values.iban}
        onChange={handleChange}
        className="w-full border border-primary rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <InputField
        type="number"
        name="amount"
        placeholder="Amount"
        value={values.amount}
        onChange={handleChange}
        className="w-full border border-primary rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <InputField
        type="text"
        name="starting_on"
        placeholder="Starting date"
        value={values.starting_on}
        onChange={handleChange}
        className="w-full border border-primary rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <select
        name="interval"
        className="bg-white outline-none border-2 border-secondary-dark rounded py-1 px-2 focus:border-primary transition-colors duration-300s ease w-full"
      >
        {intervals.map((interval) => (
          <option key={interval} value={interval}>
            {interval}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark transition duration-300 w-full"
      >
        Ajouter
      </button>
    </form>
  );
}
