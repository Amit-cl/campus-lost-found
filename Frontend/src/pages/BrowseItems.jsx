import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api.js";
import ItemCard from "../components/ItemCard.jsx";

const categories = ["all", "ID Card", "Phone", "Laptop", "Keys", "Wallet", "Books", "Bag", "Bottle", "Documents", "Other"];
const locations = ["all", "Library", "Cafeteria", "Hostel", "Admin Block", "Classroom", "Lab", "Parking", "Sports Ground", "Bus Stop", "Other"];

function BrowseItems() {
  const [params] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: params.get("search") || "",
    type: "all",
    category: "all",
    location: "all",
    status: "all",
  });

  useEffect(() => {
    setLoading(true);
    api.get("/items", { params: filters })
      .then((res) => setItems(res.data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [filters]);

  const openCount = useMemo(() => items.filter((item) => item.status === "open").length, [items]);

  const update = (name, value) => setFilters((old) => ({ ...old, [name]: value }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">Campus board</p>
          <h1 className="mt-3 font-display text-5xl font-bold">Browse listings</h1>
          <p className="mt-2 text-muted">{items.length} matched items, {openCount} still open.</p>
        </div>
      </div>

      <section className="mb-8 grid gap-3 rounded-2xl bg-panel p-4 card-line md:grid-cols-5">
        <input className="input-dark md:col-span-2" placeholder="Search item or place" value={filters.search} onChange={(e) => update("search", e.target.value)} />
        <Select value={filters.type} onChange={(e) => update("type", e.target.value)} options={["all", "lost", "found"]} />
        <Select value={filters.category} onChange={(e) => update("category", e.target.value)} options={categories} />
        <Select value={filters.status} onChange={(e) => update("status", e.target.value)} options={["all", "open", "claimed"]} />
        <Select value={filters.location} onChange={(e) => update("location", e.target.value)} options={locations} className="md:col-span-5" />
      </section>

      {loading ? (
        <p className="text-muted">Loading items...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-panel p-10 text-center card-line">
          <h2 className="font-display text-3xl">No items found</h2>
          <p className="mt-2 text-muted">Try a different keyword or filter.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => <ItemCard key={item._id} item={item} />)}
        </div>
      )}
    </main>
  );
}

function Select({ options, className = "", ...props }) {
  return (
    <select className={`input-dark capitalize ${className}`} {...props}>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}

export default BrowseItems;
