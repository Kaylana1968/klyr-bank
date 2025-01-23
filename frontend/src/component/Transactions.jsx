import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import { TransactionsAPI } from "../API/TransactionsAPI";
import { useFormik } from "formik";

function Transactions() {
  const [transactions, setTransaction] = useState([]);
  const [filteredTransactions, setFilteredTransaction] = useState([]);
  // const [responseMessage, setResponseMessage] = useState([])

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
        if (type == "virements" && transaction.status != null){
          return transaction;
        } else if (type == "depots" && transaction.status == null){
          return transaction
        } else if (type == "all") {
          return transaction
        }
      });

      setFilteredTransaction(typeFilter);
    },
  });

  return (
    <>
      <div>
        <form onChange={handleSubmit}>
          <div className="flex flex-col">
            <label name="amount">Montant</label>
            <input
              className="border p-2"
              placeholder="Rechercher"
              name="amount"
              type="number"
              value={values.amount}
              onChange={handleChange}
            />
            <select name="type" value={values.type} onChange={handleChange}>
              <option value="all">All</option>
              <option value="virements">Virements</option>
              <option value="depots">Dépôts</option>
            </select>
          </div>
        </form>

        <h1 className="py-2">Mes virements et dépôts :</h1>

        {filteredTransactions.map((transaction, index) => (
          <Fragment key={index}>
            <hr />
            <div className="py-4">
              {(transaction.status != null && (
                <h2 className="font-bold">Virement</h2>
              )) || <h2 className="font-bold">Dépôt</h2>}
              <p>Date : {transaction.done_at}</p>
              <p>Montant : {transaction.amount}</p>
              {transaction.receiver_account_id != null && (
                <p>Créditeur : {transaction.receiver_account_id}</p>
              )}
              {transaction.status != null && (
                <p>Status : {transaction.status}</p>
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </>
  );
}

export default Transactions;
