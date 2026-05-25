import React from "react";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

function ItemCard({ item }) {
  return (
    <Link to={`/items/${item._id}`} className="group overflow-hidden rounded-2xl bg-panel card-line shadow-glow transition hover:-translate-y-1 hover:border-gold/50">
      <div className="relative h-56 overflow-hidden bg-slate-900">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center text-5xl text-slate-600">▧</div>
        )}
        <div className="absolute left-4 top-4"><StatusBadge type={item.type} status={item.status} /></div>
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="font-display text-2xl font-bold text-cream">{item.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{item.description}</p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-400">
          <span className="flex items-center gap-1"><MapPin size={15} /> {item.location}</span>
          <span className="flex items-center gap-1"><CalendarDays size={15} /> {new Date(item.itemDate).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default ItemCard;
