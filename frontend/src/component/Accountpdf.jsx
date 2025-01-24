import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Button from "./ui/Button";
import {
  Page,
  Text,
  View,
  Document,
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer";
import { MyAccountAPI } from "../API/MyAccountAPI";
import { TransactionsAPI } from "../API/TransactionsAPI";
import InputField from "./ui/InputField";
import { useFormik } from "formik";

const styles = {
  container: {
    padding: "16px",
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: "24px",
    marginBottom: "16px",
    fontWeight: "bold",
  },
  text: {
    marginBottom: "8px",
  },
};

export default function Accountpdf() {
  const [account, setAccount] = useState([]);
  const [transactions, setTransaction] = useState([]);
  const [filteredTransactions, setFilteredTransaction] = useState([]);
  const { account_id } = useParams();

  useEffect(() => {
    async function getaccount(accountId) {
      try {
        const response = await MyAccountAPI(accountId);
        setAccount(response);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des transactions : ",
          error
        );
      }
    }
    getaccount(account_id);
  }, [account_id]);

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
      startDate: "", 
      endDate: "",
    },
    onSubmit: ({ startDate, endDate }) => {
      if (!startDate || !endDate) {
        console.warn("Les dates de début et de fin doivent être renseignées.");
        return;
      }
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      const result = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.done_at);
        return (
          transactionDate >= parsedStartDate && transactionDate <= parsedEndDate
        );
      });
  
      setFilteredTransaction(result);
    },
  });
  

  const MyDocument = () => (
    <Document>
      <Page style={styles.container}>
        <View>
          <Text style={styles.title}>Détails du compte</Text>
          <Text style={styles.text}>Nom du compte: {account.name}</Text>
          <Text style={styles.text}>ID du compte: {account.id}</Text>
          <Text style={styles.text}>IBAN: {account.iban}</Text>
          <Text style={styles.text}>
            Compte principal: {account.is_main ? "Oui" : "Non"}
          </Text>
          <Text style={styles.text}>Solde du compte: {account.amount}</Text>
          <Text style={styles.text}>Ouvert le: {account.open_at}</Text>
          <Text style={styles.text}>{"\n"}</Text>
        </View>
        <View>
          <Text style={styles.title}>Transactions</Text>
          {filteredTransactions.map((transaction, index) => (
            <View key={index} style={styles.transaction}>
              <Text style={styles.text}>Montant: {transaction.amount}</Text>
              <Text style={styles.text}>Date: {transaction.done_at}</Text>
              <Text style={styles.text}>
                Type: {transaction.is_deposit ? "Dépot" : "Retrait"}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="p-6 max-h-[40vh] overflow-auto">
      <div className="mb-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          <InputField
            className="border border-primary p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Date de début"
            name="startDate"
            type="date"
            value={values.startDate}
            onChange={handleChange}
          />
          <InputField
            className="border border-primary p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Date de fin"
            name="endDate"
            type="date"
            value={values.endDate}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Filtrer
          </button>
        </form>
      </div>
      <div className="flex justify-between items-center mb-6">
        <PDFDownloadLink
          document={<MyDocument />}
          fileName="relevé_de_compte.pdf"
        >
          <Button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
            Télécharger PDF
          </Button>
        </PDFDownloadLink>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <PDFViewer className="w-full h-96">
          <MyDocument />
        </PDFViewer>
      </div>
    </div>
  );
}
