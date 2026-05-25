import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../api/api.js";
import ItemCard from "../components/ItemCard.jsx";

function Home() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/items").then((res) => setItems(res.data.items.slice(0, 8))).catch(() => setItems([]));
  }, []);

  const filtered = items.filter((item) => tab === "all" || item.type === tab);
  const claimedCount = items.filter((item) => item.status === "claimed").length;

  const handleSearch = () => {
    navigate(`/items?search=${encodeURIComponent(search)}`);
  };

  return (
    <main>
      <section className="hero-bg border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.45em] text-gold">Campus lost & found</p>
          <h1 className="max-w-3xl font-display text-6xl font-black leading-none md:text-7xl">
            Every lost thing <span className="text-gold">deserves</span> to be found again.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
            A secure campus board where students post what they have lost — and what they have found. Claim requests are approved by the item poster with pickup instructions.
          </p>

          <div className="mt-12 flex max-w-4xl flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={22} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="input-dark pl-12"
                placeholder="Search by item, location, or keyword..."
              />
            </div>
            <button onClick={handleSearch} className="btn-gold px-8">Search</button>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-panel">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          <Stat number={items.length || 0} label="Items listed" />
          <Stat number={claimedCount} label="Reunited" />
          <Stat number="10" label="Campus zones" />
          <Stat number="Secure" label="Claim flow" />
        </div>
      </section>

      <section id="browse" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-4xl font-bold">Recent listings</h2>
            <p className="mt-2 text-muted">Updated whenever students post items.</p>
          </div>

          <div className="flex rounded-xl bg-panelSoft p-1">
            {["all", "lost", "found"].map((name) => (
              <button
                key={name}
                onClick={() => setTab(name)}
                className={`rounded-lg px-6 py-3 capitalize ${tab === name ? "bg-ink text-cream" : "text-muted"}`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((item) => <ItemCard key={item._id} item={item} />)}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl bg-panel p-10 text-center card-line">
            <p className="text-muted">No listings yet. Be the first to post an item.</p>
            <Link to="/report" className="btn-gold mt-5 inline-block">Post item</Link>
          </div>
        )}
      </section>

      <section className="border-t border-slate-800 bg-panel py-16">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <h2 className="font-display text-4xl font-bold">Found something on campus?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">Post it with a photo. The real owner can send proof, and you approve only when you are satisfied.</p>
          <Link to="/report" className="btn-gold mt-8 inline-block">+ Post item</Link>
        </div>
      </section>
    </main>
  );
}

function Stat({ number, label }) {
  return (
    <div className="border-r border-slate-800 px-6 py-8 last:border-r-0 md:px-10">
      <div className="font-display text-4xl font-black text-gold">{number}</div>
      <div className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-muted">{label}</div>
    </div>
  );
}

export default Home;
