import { useState } from "react";
import { ApiError, api } from "../api/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const getLoginErrorMessage = (apiError: ApiError) => {
    if (apiError.status === 400) {
      return "Invalid email or password.";
    }
    return apiError.message || "Login failed. Please try again.";
  };

  const handleLogin = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setError("");
      const res = await api("/auth/signin", "POST", { email: normalizedEmail, password });
      if (res.token) {
        setToken(res.token);
        navigate("/");
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(getLoginErrorMessage(apiError));
    }
  };

  return (
    <div className="mx-auto max-w-lg brutal-card bg-background p-6">
      <h2 className="inline-block bg-accent px-4 py-2 text-3xl font-black uppercase brutal-card">
        Login
      </h2>
      <div className="mt-6 space-y-4">
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="brutal-input w-full bg-background px-3 py-2 outline-none"
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="brutal-input w-full bg-background px-3 py-2 outline-none"
        />
        <button
          onClick={handleLogin}
          className="brutal-btn w-full bg-primary px-4 py-3 text-sm text-background transition hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          Login
        </button>
        {error && (
          <p className="brutal-card inline-block bg-primary px-3 py-2 font-black uppercase text-background">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}