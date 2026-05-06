import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="border-b-4 border-text bg-secondary px-4 py-3 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link
          to="/"
          className="brutal-btn bg-accent px-4 py-2 text-sm text-text transition hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          Events
        </Link>

        <div className="flex items-center gap-3">
          {!token ? (
            <>
              <Link
                to="/login"
                className="brutal-btn bg-background px-4 py-2 text-xs text-text transition hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="brutal-btn bg-primary px-4 py-2 text-xs text-background transition hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="brutal-btn bg-primary px-4 py-2 text-xs text-background transition hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}