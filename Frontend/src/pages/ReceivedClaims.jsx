import React, { useEffect, useState } from "react";
import api from "../api/api.js";

function ReceivedClaims() {
  const [claims, setClaims] = useState([]);
  const [message, setMessage] = useState("");

  const load = () => {
    api.get("/claims/received").then((res) => setClaims(res.data.claims)).catch(() => setClaims([]));
  };

  useEffect(() => { load(); }, []);

  const approve = async (claimId) => {
    const handoverInstruction = window.prompt("Enter pickup/contact instructions for the requester:");
    if (!handoverInstruction) return;

    try {
      await api.patch(`/claims/${claimId}/approve`, { handoverInstruction });
      setMessage("Claim approved and instructions sent.");
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Approval failed.");
    }
  };

  const reject = async (claimId) => {
    if (!confirm("Reject this claim request?")) return;
    try {
      await api.patch(`/claims/${claimId}/reject`);
      setMessage("Claim rejected.");
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Reject failed.");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">Poster control</p>
      <h1 className="mt-3 font-display text-5xl font-bold">Received claims</h1>
      <p className="mt-2 text-muted">Students claiming items you posted. Approve only after checking proof.</p>
      {message && <p className="mt-5 rounded-xl bg-gold/10 p-3 text-sm text-gold">{message}</p>}

      <div className="mt-8 space-y-5">
        {claims.map((claim) => (
          <article key={claim._id} className="rounded-3xl bg-panel p-6 card-line">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${badge(claim.status)}`}>{claim.status}</span>
                <h2 className="mt-4 font-display text-3xl font-bold">{claim.item?.title}</h2>
                <p className="mt-2 text-sm text-muted">Requested by: {claim.requestedBy?.name} ({claim.requestedBy?.email})</p>
                <div className="mt-5 rounded-2xl bg-ink/50 p-5">
                  <h3 className="font-bold text-gold">Proof message</h3>
                  <p className="mt-2 leading-7 text-muted">{claim.message}</p>
                </div>
                {claim.handoverInstruction && (
                  <div className="mt-4 rounded-2xl bg-emerald-500/10 p-4 text-emerald-200">
                    Instructions sent: {claim.handoverInstruction}
                  </div>
                )}
              </div>
              {claim.item?.imageUrl && <img src={claim.item.imageUrl} alt="" className="h-32 w-44 rounded-2xl object-cover" />}
            </div>

            {claim.status === "pending" && claim.item?.status !== "claimed" && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => approve(claim._id)} className="btn-gold">Approve + add instructions</button>
                <button onClick={() => reject(claim._id)} className="btn-dark border-red-500/30 text-red-300 hover:text-red-200">Reject</button>
              </div>
            )}
          </article>
        ))}
      </div>

      {claims.length === 0 && <p className="mt-10 rounded-2xl bg-panel p-8 text-center text-muted card-line">No claim requests received yet.</p>}
    </main>
  );
}

function badge(status) {
  if (status === "approved") return "bg-emerald-300 text-emerald-900";
  if (status === "rejected") return "bg-red-300 text-red-900";
  return "bg-gold text-black";
}

export default ReceivedClaims;
