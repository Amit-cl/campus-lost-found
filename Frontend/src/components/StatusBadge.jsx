import React from "react";

function StatusBadge({ type, status }) {
  const isLost = type === "lost";
  const claimed = status === "claimed";

  if (claimed) {
    return <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-black">Claimed</span>;
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${isLost ? "bg-red-200 text-red-700" : "bg-teal-200 text-teal-700"}`}>
      {isLost ? "Lost" : "Found"}
    </span>
  );
}

export default StatusBadge;
