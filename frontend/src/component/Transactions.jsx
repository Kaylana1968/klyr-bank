import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import { TransactionsAPI } from "../API/TransactionsAPI";
import { useFormik } from "formik";
import InputField from "./ui/InputField";

function Transactions() {
  const [transactions, setTransaction] = useState([]);
  const [filteredTransactions, setFilteredTransaction] = useState([]);

  const { account_id } = useParams();

  useEffect(() => {
    async function fetchTransactions(accountId) {
      try {
        const response = await TransactionsAPI(accountId);
        setTransaction(response);
        setFilteredTransaction(response);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des transactions : ",
          error
        );
      }
    }
    fetchTransactions(account_id);
  }, [account_id]);

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      type: "all",
      amount: "",
    },
    onSubmit: ({ amount, type }) => {
      const amountFilter = transactions.filter((transaction) => {
        if (amount != "" && amount == transaction.amount) {
          return transaction;
        } else if (amount == "") {
          return transaction;
        }
      });
      const typeFilter = amountFilter.filter((transaction) => {
        if (type == "virements" && transaction.status != null) {
          return transaction;
        } else if (type == "depots" && transaction.status == null) {
          return transaction;
        } else if (type == "all") {
          return transaction;
        }
      });

      setFilteredTransaction(typeFilter);
    },
  });

  return (
    <>
      <div className="p-6 min-h-[95vh]">
        <form
          onChange={handleSubmit}
          className="bg-white shadow-md p-4 rounded-lg"
        >
          <div className="flex flex-col gap-4">
            <label name="amount" className="text-primary font-semibold">
              Montant
            </label>
            <InputField
              className="border border-primary p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Rechercher"
              name="amount"
              type="number"
              value={values.amount}
              onChange={handleChange}
            />
            <select
              name="type"
              value={values.type}
              onChange={handleChange}
              className="bg-white outline-none border-2 border-secondary-dark rounded py-1 px-2 focus:border-primary transition-colors duration-300s ease"
            >
              <option value="all">All</option>
              <option value="virements">Virements</option>
              <option value="depots">Dépôts</option>
            </select>
          </div>
        </form>

        <h1 className="py-4 text-primary text-lg font-bold">
          Mes virements et dépôts :
        </h1>

        {filteredTransactions.map((transaction, index) => (
          <Fragment key={index}>
            <hr className="border-primary my-4" />
            <div className="py-4 bg-white shadow-sm rounded-lg p-4">
              {(transaction.status != null && (
                <h2 className="font-bold text-primary">Virement</h2>
              )) || <h2 className="font-bold text-primary">Dépôt</h2>}
              <p className="text-gray-700">Date : {transaction.done_at}</p>
              <p className="text-gray-700">Montant : {transaction.amount}</p>
              {transaction.receiver_account_id != null && (
                <p className="text-gray-700">
                  Créditeur : {transaction.receiver_account_id}
                </p>
              )}
              {transaction.status != null && (
                <p className="text-gray-700">Status : {transaction.status}</p>
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </>
  );
}

export default Transactions;
