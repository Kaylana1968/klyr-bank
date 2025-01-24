import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import useSWR from "swr";
import { GETfetcher } from "../constants/fetcher";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: "Évolution du solde total",
      },
    },
};

//const labels = ['Soldes'];

export default function Dashboard() {

    const { data: accounts, isLoading } = useSWR(
		"http://127.0.0.1:8000/api/my-accounts",
		GETfetcher
	);

    console.log(accounts)

    const dataSolde = {
        labels: ["Comptes"], // Une seule colonne pour tous les comptes
        datasets: accounts
          ? accounts.map((account, index) => ({
              label: account.name, // Le nom du compte
              data: [account.amount], // Montant du compte
              backgroundColor: `rgba(${53 + index * 20}, ${162 + index * 10}, 235, 0.5)`, // Couleur dynamique
            }))
          : [],
      };
      
      
    console.log(dataSolde)

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!accounts) {
        return <div>No account data available.</div>;
    }

    return (
        <Bar 
            options={options} 
            data={dataSolde} 
        />
    );
}
