import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TransactionsAPI } from '../API/TransactionsAPI';
import { useEffect, useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: "Évolution des recettes",
        },
    },
};



export default function DashboardRecette({ accounts, datesList }) {
    const [dataSolde, setDataSolde] = useState()

    useEffect(() => {
        //getDaysBetween(startDate, endDate)
        async function getDataSolde() {

            const datasets = await Promise.all(accounts.map(async (account, index) => {
                const transactions = await TransactionsAPI(account.id)

                const data = datesList.map(date => {
                    const dateObject = new Date(date)
                    dateObject.setHours(0, 0, 0, 0)
                    // console.log(dateObject)
                    // console.log(transactions)

                    const amount = transactions
                        .filter(transaction => {
                            const transactionDate = new Date(transaction.done_at)
                            transactionDate.setHours(0, 0, 0, 0)

                            return transactionDate.getTime() === dateObject.getTime() && !transaction.receiver_account_id
                        })
                        .reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0)

                    return amount
                })

                return {
                    label: account.name, // Le nom du compte
                    data, // Montant du compte
                    backgroundColor: `rgba(${53 + index * 20}, ${162 + index * 10}, 235, 0.5)`, // Couleur dynamique
                }
            }));

            const dataSolde = {
                labels: datesList, // Une seule colonne pour tous les comptes
                datasets
            };

            setDataSolde(dataSolde)
        }

        accounts && getDataSolde()
    }, [setDataSolde, accounts, datesList])

    if (!dataSolde) {
        return <div>Loading...</div>;
    }

    return (
        <Line
            options={options}
            data={dataSolde}
        />
    );
}
