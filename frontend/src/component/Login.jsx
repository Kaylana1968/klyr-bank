import { useFormik } from "formik";
import { LoginAPI } from "../API/LoginAPI";
import Card from "@mui/material/Card";
import logo_klyr_bank from "../component/pictures/klyrbank.png";
import { useContext } from "react";
import AuthContext from "../auth.context";

function Login() {
  const { setToken } = useContext(AuthContext);

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ email, password }) => {
      LoginAPI(email, password, setToken);
    },
  });

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full bg-gray-50">
      <img
        src={logo_klyr_bank}
        alt="Logo Klyr Bank"
        className="w-48 h-auto mb-6"
      />
      <Card className="p-6 w-full max-w-md bg-white shadow-lg rounded-lg">
        <h2 className="text-center text-primary font-bold text-2xl mb-3">
          Se connecter
        </h2>
        <h1 className="text-center text-sm mb-6">
          Vous n&apos;avez pas encore de compte ?
          <button
            onClick={() => (window.location.href = "/register")}
            className="text-primary hover:underline"
          >
            Créer un compte
          </button>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Entrez votre email"
              value={values.email}
              onChange={handleChange}
              className="w-full p-3 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary mb-1"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={values.password}
              onChange={handleChange}
              className="w-full p-3 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            style={{ color: "white" }}
            className="p-3 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition"
          >
            Se connecter
          </button>
        </form>
      </Card>
    </div>
  );
}

export default Login;
