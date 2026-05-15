import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
        },
      },
    });

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          full_name: form.fullName,
          email: form.email,
        },
      ]);

      if (profileError) {
        await supabase.auth.signOut();
        setLoading(false);
        setMessage("Registration failed while saving profile. Please try again.");
        return;
      }

      const { data: spaceData, error: spaceError } = await supabase
        .from("spaces")
        .insert([
          {
            name: "Personal",
            type: "personal",
            owner_id: user.id,
            emoji: "💰",
          },
        ])
        .select()
        .single();

      if (spaceError) {
        await supabase.auth.signOut();
        setLoading(false);
        setMessage("Registration failed while creating your space. Please try again.");
        return;
      }

      const { error: memberError } = await supabase.from("space_members").insert([
        {
          space_id: spaceData.id,
          user_id: user.id,
        },
      ]);

      if (memberError) {
        await supabase.auth.signOut();
        setLoading(false);
        setMessage("Registration failed while setting up membership. Please try again.");
        return;
      }
    }

    setLoading(false);
    setMessage("Account created successfully!");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-logo">
          <Wallet size={34} />
        </div>

        <h1>Spendie</h1>
        <p>Start your friendly budgeting space today.</p>

        <div className="auth-tags">
          <span>💰 Personal</span>
          <span>👥 Shared</span>
          <span>🎯 Goals</span>
        </div>
      </div>

      <form className="auth-card modern-auth-card" onSubmit={handleRegister}>
        <p className="auth-kicker">Create account</p>
        <h2>Join Spendie</h2>
        <p className="auth-subtitle">Create your personal wallet and invite others later.</p>

        <input
          type="text"
          name="fullName"
          placeholder="Full name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

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
          {loading ? "Creating account..." : "Create account"}
        </button>

        {message && <p className="message">{message}</p>}

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;