import { useState } from "react";
import useSWR from "swr";
import { GETfetcher } from "../constants/fetcher";
import { useFormik } from "formik";
import { CreateTransactionAPI } from "../API/CreateTransactionAPI";
import { GetAccountByIban } from "../API/MyAccountsAPI";

function Virement() {
	const [responseMessage, setResponseMessage] = useState("");

	const { data: accounts, isLoading } = useSWR(
		"http://127.0.0.1:8000/api/my-accounts",
		GETfetcher
	);

	const { values, handleChange, handleSubmit, errors } = useFormik({
		initialValues: {
			sender: null,
			iban: null,
			amount: ""
		},
		validate: ({ sender, iban, amount }) => {
			const errors = {};

			if (sender === null) {
				errors.sender = "Sender account is empty";
			}
			if (iban === null) {
				errors.iban = "Iban account is empty";
			}
			if (amount === "") {
				errors.amount = "Amount is empty";
			}

			return errors;
		},
		onSubmit: async ({ sender, iban, amount }) => {
			try {
				const resp = await GetAccountByIban(iban);

				const response = await CreateTransactionAPI(sender, resp.id, amount);

				console.log(response);
				setResponseMessage("Transaction effectué avec succès !");
			} catch (error) {
				console.log(error.message);
				setResponseMessage(error.message);
			}
		}
	});

	return (
		<>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<div>
					<h3 className="font-bold my-5">Effectuer un virement</h3>
					<form onSubmit={handleSubmit} className="flex flex-col gap-2">
						<div className="flex flex-col ">
							<label>Débiteur</label>
							<select
								name="sender"
								value={values.sender}
								onChange={handleChange}
							>
								<option value={null}>Selectionner un compte</option>
								{accounts.map(account => (
									<option key={account.id} value={account.id}>
										{account.name}
									</option>
								))}
							</select>
							{errors.sender && (
								<p className="text-red-500 text-sm">{errors.sender}</p>
							)}
						</div>
						<div className="flex flex-col">
							<label>Destinataire</label>
							<input
								className="border p"
								type="text"
								name="iban"
								placeholder="Entrer un IBAN"
								value={values.iban}
								onChange={handleChange}
							/>
							{errors.iban && (
								<p className="text-red-500 text-sm">{errors.iban}</p>
							)}
						</div>
						<div className="flex flex-col">
							<label>Montant</label>
							<input
								className="border p"
								type="number"
								name="amount"
								placeholder="Entrer un montant"
								value={values.amount}
								onChange={handleChange}
							/>
							{errors.amount && (
								<p className="text-red-500 text-sm">{errors.amount}</p>
							)}
						</div>
						<button type="submit" className="border border-black">
							Envoyer
						</button>
					</form>
					<p>{responseMessage}</p>
				</div>
			)}
		</>
	);
}

export default Virement;
