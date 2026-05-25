import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/items");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-74px)] place-items-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-panel p-8 card-line shadow-glow">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">Join campus board</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Create account</h1>
        <p className="mt-2 text-muted">Required for posting, claim requests and approvals.</p>

        {error && <p className="mt-5 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

        <div className="mt-6 space-y-4">
          <input className="input-dark" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input-dark" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input-dark" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>

        <button disabled={loading} className="btn-gold mt-6 w-full">{loading ? "Creating..." : "Create account"}</button>
        <p className="mt-5 text-center text-sm text-muted">Already registered? <Link className="text-gold" to="/login">Login</Link></p>
      </form>
    </main>
  );
}

export default Register;
