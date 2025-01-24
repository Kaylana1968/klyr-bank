import Snackbar from "@mui/material/Snackbar";
import CancelTransactionAPI from "../API/CancelTransactionAPI";

export default function CancelTransaction({
	transactionToCancel,
	setTransactionToCancel
}) {
	function cancel() {
		CancelTransactionAPI(transactionToCancel.id);
		setTransactionToCancel();
	}

	return (
		<Snackbar
			open={transactionToCancel}
			onClose={() => setTransactionToCancel()}
			autoHideDuration={5000}
			disableWindowBlurListener={true}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			message="Cancel the transaction ?"
			action={
				<button type="button" onClick={cancel}>
					Cancel
				</button>
			}
		/>
	);
}
