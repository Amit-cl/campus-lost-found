import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

const categories = ["ID Card", "Phone", "Laptop", "Keys", "Wallet", "Books", "Bag", "Bottle", "Documents", "Other"];
const locations = ["Library", "Cafeteria", "Hostel", "Admin Block", "Classroom", "Lab", "Parking", "Sports Ground", "Bus Stop", "Other"];

function ReportItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", type: "lost", category: "", description: "", location: "", itemDate: "", contact: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const changeImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (image) data.append("image", image);

      await api.post("/items", data);
      navigate("/my-posts");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to post item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">Report item</p>
        <h1 className="mt-3 font-display text-5xl font-bold">Post lost or found item</h1>
        <p className="mt-2 text-muted">Photo uploads are sent to ImageKit. MongoDB stores only the image URL and file ID.</p>
      </div>

      <form onSubmit={submit} className="grid gap-6 rounded-3xl bg-panel p-6 card-line lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {message && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{message}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <select name="type" value={form.type} onChange={change} className="input-dark">
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            <input name="title" value={form.title} onChange={change} className="input-dark" placeholder="Item name" required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <select name="category" value={form.category} onChange={change} className="input-dark" required>
              <option value="">Category</option>
              {categories.map((x) => <option key={x}>{x}</option>)}
            </select>
            <select name="location" value={form.location} onChange={change} className="input-dark" required>
              <option value="">Campus location</option>
              {locations.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>

          <textarea name="description" value={form.description} onChange={change} className="input-dark min-h-36" placeholder="Describe color, brand, special marks, or safe details." required />

          <div className="grid gap-4 sm:grid-cols-2">
            <input name="itemDate" type="date" value={form.itemDate} onChange={change} className="input-dark" required />
            <input name="contact" value={form.contact} onChange={change} className="input-dark" placeholder="Contact after approval" required />
          </div>

          <button disabled={loading} className="btn-gold w-full">{loading ? "Posting..." : "Submit item"}</button>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-700 bg-ink/40 p-5">
          <label className="block text-sm font-semibold text-muted">Upload clear image</label>
          <input type="file" accept="image/*" onChange={changeImage} className="mt-3 w-full rounded-xl border border-slate-700 bg-panelSoft p-3 text-sm text-muted" />
          <p className="mt-3 text-xs text-muted">Max 5MB. Image goes to ImageKit.</p>
          <div className="mt-5 grid h-72 place-items-center overflow-hidden rounded-2xl bg-panelSoft">
            {preview ? <img src={preview} alt="preview" className="h-full w-full object-cover" /> : <span className="text-slate-500">Image preview</span>}
          </div>
        </div>
      </form>
    </main>
  );
}

export default ReportItem;
