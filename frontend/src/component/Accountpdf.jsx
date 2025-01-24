import { useEffect, useState } from "react";
import { useParams } from "react-router";
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
        console.log(response);
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
          {transactions.map((transaction, index) => (
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
    <div>
      <PDFDownloadLink document={<MyDocument />} fileName="relevé de compte">
        <button>Dowload PDF</button>
      </PDFDownloadLink>
    </div>
  );
}
