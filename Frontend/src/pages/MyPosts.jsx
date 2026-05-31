import React, { useEffect, useState } from "react";
import api from "../api/api.js";
import ItemCard from "../components/ItemCard.jsx";

function MyPosts() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const load = () => {
    api.get("/items/mine").then((res) => setItems(res.data.items)).catch(() => setItems([]));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this item and its claim requests?")) return;
    try {
      await api.delete(`/items/${id}`);
      setMessage("Item deleted.");
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">My dashboard</p>
      <h1 className="mt-3 font-display text-5xl font-bold">My posts</h1>
      <p className="mt-2 text-muted">Items you reported. You can receive and approve claim requests for these.</p>
      {message && <p className="mt-5 rounded-xl bg-gold/10 p-3 text-sm text-gold">{message}</p>}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item._id}>
            <ItemCard item={item} />
            <button onClick={() => remove(item._id)} className="mt-3 w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 hover:bg-red-500/20">Delete post</button>
          </div>
        ))}
      </div>

      {items.length === 0 && <p className="mt-10 rounded-2xl bg-panel p-8 text-center text-muted card-line">You have not posted anything yet.</p>}
    </main>
  );
}

export default MyPosts;
