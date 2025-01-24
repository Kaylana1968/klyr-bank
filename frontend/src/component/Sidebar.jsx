import { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import AuthContext from "../auth.context";
import { logout } from "../auth";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/register" && !token)
      navigate("/login");
  }, [pathname, navigate, token]);

  return (
    <aside className="h-screen min-w-40 bg-secondary text-primary flex flex-col items-center">
      <h1 className="text-center text-xl font-bold py-5">KLYR Bank</h1>
      <hr className="w-2/3 border-primary" />
      <nav className="flex flex-col w-full gap-2 py-5 flex-grow">
        {!token && (
          <div className="flex flex-col w-full">
            <Link
              to="/register"
              className="py-2 px-6 hover:bg-secondary-dark hover:text-white transition-colors duration-300"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="py-2 px-6 hover:bg-secondary-dark hover:text-white transition-colors duration-300"
            >
              Login
            </Link>
          </div>
        )}

        {token && (
          <>
            <Link
              to="/my-accounts"
              className="py-2 px-6 hover:bg-secondary-dark hover:text-white transition-colors duration-300"
            >
              My accounts
            </Link>
            <Link
              to="/virement"
              className="py-2 px-6 hover:bg-secondary-dark hover:text-white transition-colors duration-300"
            >
              Virement
            </Link>
            <Link
              to="/profile"
              className="py-2 px-6 hover:bg-secondary-dark hover:text-white transition-colors duration-300"
            >
              Profile
            </Link>
            <Link
              to="/dashboard"
              className="py-2 px-6 hover:bg-secondary-dark hover:text-white transition-colors duration-300"
            >
              Dashboard
            </Link>
          </>
        )}
      </nav>

      {token && (
        <button
          onClick={() => logout()}
          className="bg-secondary text-primary font-bold py-2 px-4 rounded hover:bg-secondary-dark transition duration-300 w-full max-w-md mx-auto mb-4"
        >
          Déconnexion
        </button>
      )}
    </aside>
  );
}
