import { useState } from "react";
import { changePassword } from "../API/ChangePassword";
import { useFormik } from "formik";
import { logout } from "../auth";
import Modal from "@mui/material/Modal";
import InputField from "./ui/InputField";
import Title from "./ui/Title";

function Profil() {
  const [responseMessage, setResponseMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [password, setPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_new_password, setConfirmNewPassword] = useState("");

  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: {
      password: "",
      new_password: "",
      confirm_new_password: "",
    },
    validate: ({ new_password, confirm_new_password }) => {
      const errors = {};
      if (!new_password) errors.new_password = "Password required";
      else if (new_password.length < 8)
        errors.new_password = "Password is too short (min 8 characters)";
      else if (
        !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].some((number) =>
          new_password.includes(number)
        )
      )
        errors.new_password = "Password must include at least one number";
      else if (
        !["&", "#", "-", "_", "!", "?", "*", "@", ".", ":", ";"].some((char) =>
          new_password.includes(char)
        )
      )
        errors.new_password =
          "Password must include at least one of &#-_!?*@.:;";
      else if (new_password != confirm_new_password)
        errors.new_password =
          "Password missmatch with the new confirm password";

      return errors;
    },
    onSubmit: async ({ password, new_password, confirm_new_password }) => {
      handleOpen();
      setPassword(password);
      setNewPassword(new_password);
      setConfirmNewPassword(confirm_new_password);
    },
  });

  const confirm_change_password = async () => {
    console.log(password, new_password, confirm_new_password);
    try {
      const response = await changePassword(
        password,
        new_password,
        confirm_new_password
      );
      console.log(response);
      setResponseMessage("Mot de passe changé avec succès !");
      logout();
    } catch (error) {
      setResponseMessage(error.message);
    }
  };

  return (
    <>
	<Title>Page de profil</Title>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 shadow-md rounded-lg max-w-md mx-auto w-full"
      >
		<h2 className="text-center text-primary font-bold text-2xl mb-3">
          Changer de mot de passe
        </h2>
        <InputField
          type="password"
          name="password"
          placeholder="Mot de passe actuel"
          value={values.password}
          onChange={handleChange}
          className="w-full border border-primary rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <InputField
          type="password"
          name="new_password"
          placeholder="Nouveau mot de passe"
          value={values.new_password}
          onChange={handleChange}
          className="w-full border border-primary rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.new_password && touched.new_password && (
          <span className="text-red-500 text-sm">{errors.new_password}</span>
        )}
        <InputField
          type="password"
          name="confirm_new_password"
          placeholder="Confirmer le nouveau mot de passe"
          value={values.confirm_new_password}
          onChange={handleChange}
          className="w-full border border-primary rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.confirm_new_password && touched.confirm_new_password && (
          <span className="text-red-500 text-sm">
            {errors.confirm_new_password}
          </span>
        )}
        <button
          type="submit"
          className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark transition duration-300 w-full"
        >
          Changer de mot de passe
        </button>
      </form>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2
              id="modal-modal-title"
              className="text-primary text-lg font-bold mb-4"
            >
              Êtes-vous sûr de vouloir changer de mot de passe ?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={confirm_change_password}
                className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
              >
                Oui
              </button>
              <button
                onClick={handleClose}
                className="bg-secondary text-primary font-bold py-2 px-4 rounded hover:bg-secondary-dark transition duration-300"
              >
                Non
              </button>
            </div>
            {responseMessage && (
              <span className="block mt-4 text-center text-sm text-gray-700">
                {responseMessage}
              </span>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Profil;
