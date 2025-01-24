import { useFormik } from "formik";
import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { deleteAccountAPI } from "../API/DeleteAccountAPI";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function DeleteAccountModal({
  deletingAccount,
  setDeletingAccount,
}) {
  const [error, setError] = useState("");

  const { values, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues: {
      password: "",
    },
    onSubmit: ({ password }, { resetForm }) => {
      deleteAccountAPI(
        deletingAccount.id,
        password,
        setDeletingAccount,
        setError
      );
      resetForm();
    },
  });

  return (
    <Modal
      open={deletingAccount}
      onClose={() => {
        resetForm();
        setDeletingAccount();
      }}
    >
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-primary mb-4">
            Enter your password to confirm
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Mot de passe"
              className="w-full border border-primary rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
            >
              Supprimer
            </button>
          </form>

          {error && (
            <span className="text-red-600 mt-4 block text-sm">{error}</span>
          )}
        </div>
      </div>
    </Modal>
  );
}
