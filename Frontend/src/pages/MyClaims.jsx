import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    api.get("/claims/mine").then((res) => setClaims(res.data.claims)).catch(() => setClaims([]));
  }, []);

  const shown = claims.filter((claim) => tab === "all" || claim.status === tab);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">Claim tracker</p>
      <h1 className="mt-3 font-display text-5xl font-bold">My claims</h1>
      <p className="mt-2 text-muted">Requests you sent to other item posters.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {["all", "pending", "approved", "rejected"].map((x) => (
          <button key={x} onClick={() => setTab(x)} className={`rounded-xl px-5 py-3 capitalize ${tab === x ? "bg-gold text-black" : "bg-panel text-muted"}`}>{x}</button>
        ))}
      </div>

      <div className="mt-8 space-y-5">
        {shown.map((claim) => (
          <article key={claim._id} className="rounded-3xl bg-panel p-6 card-line">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${badge(claim.status)}`}>{claim.status}</span>
                <h2 className="mt-4 font-display text-3xl font-bold">{claim.item?.title || "Deleted item"}</h2>
                <p className="mt-2 text-muted">Your proof: {claim.message}</p>
                {claim.item && <Link to={`/items/${claim.item._id}`} className="mt-4 inline-block text-sm font-semibold text-gold">View item</Link>}
              </div>
              {claim.item?.imageUrl && <img src={claim.item.imageUrl} alt="" className="h-28 w-36 rounded-2xl object-cover" />}
            </div>

            {claim.status === "approved" && (
              <div className="mt-5 rounded-2xl bg-emerald-500/10 p-5 text-emerald-200">
                <h3 className="font-bold">Pickup / handover instruction</h3>
                <p className="mt-2 leading-7">{claim.handoverInstruction}</p>
                <p className="mt-2 text-sm text-emerald-300">Poster: {claim.item?.postedBy?.name} ({claim.item?.postedBy?.email})</p>
              </div>
            )}
          </article>
        ))}
      </div>

      {shown.length === 0 && <p className="mt-10 rounded-2xl bg-panel p-8 text-center text-muted card-line">No claims found.</p>}
    </main>
  );
}

function badge(status) {
  if (status === "approved") return "bg-emerald-300 text-emerald-900";
  if (status === "rejected") return "bg-red-300 text-red-900";
  return "bg-gold text-black";
}

export default MyClaims;
