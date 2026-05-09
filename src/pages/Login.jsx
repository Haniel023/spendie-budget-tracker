import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-logo">
          <Wallet size={34} />
        </div>

        <h1>Spendie</h1>
        <p>Track, share, and plan your money together.</p>

        <div className="auth-tags">
          <span>💕 Couples</span>
          <span>🏠 Family</span>
          <span>✈️ Trips</span>
        </div>
      </div>

      <form className="auth-card modern-auth-card" onSubmit={handleLogin}>
        <p className="auth-kicker">Welcome back</p>
        <h2>Login to your wallet</h2>
        <p className="auth-subtitle">Continue managing your personal and shared budgets.</p>

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p className="message">{message}</p>}

        <p className="auth-switch">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;