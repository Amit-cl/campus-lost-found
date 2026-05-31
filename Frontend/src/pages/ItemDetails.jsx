import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

function ItemDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [proof, setProof] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/items/${id}`)
      .then((res) => setItem(res.data.item))
      .catch(() => setMessage("Item not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const sendClaim = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/claims", { itemId: id, message: proof });
      setProof("");
      setMessage("Claim request sent. Check My Claims for updates.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send claim.");
    }
  };

  if (loading) return <p className="p-8 text-muted">Loading item...</p>;
  if (!item) return <p className="p-8 text-red-300">{message}</p>;

  const isPoster = user && item.postedBy?._id === user._id;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-3xl bg-panel card-line">
          <div className="relative h-[460px] bg-panelSoft">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-7xl text-slate-600">▧</div>}
            <div className="absolute left-5 top-5"><StatusBadge type={item.type} status={item.status} /></div>
          </div>
        </section>

        <section className="rounded-3xl bg-panel p-7 card-line">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">Item details</p>
          <h1 className="mt-3 font-display text-5xl font-bold">{item.title}</h1>
          <p className="mt-5 leading-8 text-muted">{item.description}</p>

          <div className="mt-6 grid gap-3 text-sm text-slate-300">
            <p className="flex items-center gap-2"><MapPin size={17} className="text-gold" /> {item.location}</p>
            <p className="flex items-center gap-2"><CalendarDays size={17} className="text-gold" /> {new Date(item.itemDate).toLocaleDateString()}</p>
            <p className="flex items-center gap-2"><ShieldCheck size={17} className="text-gold" /> Posted by {item.postedBy?.name || "Student"}</p>
          </div>

          <div className="mt-8 rounded-2xl bg-ink/50 p-5 card-line">
            <h2 className="font-display text-2xl font-bold">Claim protection</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Contact information is not openly shown. Send a proof request. The poster can approve and send pickup instructions.
            </p>
          </div>

          {message && <p className="mt-5 rounded-xl bg-gold/10 p-3 text-sm text-gold">{message}</p>}

          {!user && (
            <Link to="/login" className="btn-gold mt-6 block text-center">Login to request claim</Link>
          )}

          {user && isPoster && (
            <div className="mt-6 rounded-2xl bg-gold/10 p-4 text-sm text-gold">
              This is your post. Manage claim requests from the Requests page.
            </div>
          )}

          {user && !isPoster && item.status === "open" && (
            <form onSubmit={sendClaim} className="mt-6 space-y-4">
              <textarea
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                className="input-dark min-h-28"
                placeholder="Write proof. Example: This wallet has my student ID and a blue card inside."
                required
              />
              <button className="btn-gold w-full">Send claim request</button>
            </form>
          )}

          {item.status === "claimed" && <p className="mt-6 rounded-xl bg-emerald-500/10 p-4 text-emerald-300">This item is already claimed.</p>}
        </section>
      </div>
    </main>
  );
}

export default ItemDetails;
