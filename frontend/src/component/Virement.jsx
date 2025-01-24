import { useState } from "react";
import useSWR from "swr";
import { GETfetcher } from "../constants/fetcher";
import { useFormik } from "formik";
import { CreateTransactionAPI } from "../API/CreateTransactionAPI";
import { GetAccountByIban } from "../API/MyAccountsAPI";
import Button from "./ui/Button";
import Container from "./ui/Container";
import Title from "./ui/Title";
import InputField from "./ui/InputField";
import SelectField from "./ui/SelectField";

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

	if (isLoading) return <div>Loading...</div>;

	return (
		<Container>
			<Title>Effectuer un virement</Title>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div>
					<SelectField
						label="Débiteur"
						options={accounts}
						name="sender"
						value={values.sender}
						onChange={handleChange}
					/>
					{errors.sender && (
						<p className="text-red-500 text-sm">{errors.sender}</p>
					)}
				</div>
				<div>
					<InputField
						label="Destinataire"
						type="text"
						name="iban"
						placeholder="Entrer un IBAN"
						value={values.iban}
						onChange={handleChange}
					/>
					{errors.iban && <p className="text-red-500 text-sm">{errors.iban}</p>}
				</div>
				<div>
					<InputField
						label="Montant"
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
				<Button type="submit">Envoyer</Button>
			</form>
			<p>{responseMessage}</p>
		</Container>
	);
}

export default Virement;
