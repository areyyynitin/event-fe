import { useState } from "react";
import { ApiError, api } from "../api/client";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const getSignupErrorMessage = (apiError: ApiError) => {
    if (apiError.status === 400) {
      return apiError.message || "Please enter a valid email and password.";
    }
    return apiError.message || "Signup failed. Please try again.";
  };

  const handleSignup = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setError("");
      const res = await api("/auth/signup", "POST", { email: normalizedEmail, password });
      if (res.token) {
        navigate("/login");
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(getSignupErrorMessage(apiError));
    }
  };

  return (
    <div className="mx-auto max-w-lg brutal-card bg-background p-6">
      <h2 className="inline-block bg-secondary px-4 py-2 text-3xl font-black uppercase brutal-card">
        Signup
      </h2>
      <div className="mt-6 space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="brutal-input w-full bg-background px-3 py-2 outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="brutal-input w-full bg-background px-3 py-2 outline-none"
        />
        <button
          onClick={handleSignup}
          className="brutal-btn w-full bg-accent px-4 py-3 text-sm text-text transition hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          Signup
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