import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `text-sm transition ${isActive ? "text-gold" : "text-muted hover:text-cream"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold font-bold text-black">L</span>
          <span className="font-display text-xl font-bold">LostFound</span>
          <span className="hidden rounded-lg border border-slate-700 px-2 py-1 text-xs text-muted sm:block">Campus</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/items" className={linkClass}>Browse</NavLink>
          {user && <NavLink to="/my-posts" className={linkClass}>My posts</NavLink>}
          {user && <NavLink to="/my-claims" className={linkClass}>My claims</NavLink>}
          {user && <NavLink to="/received-claims" className={linkClass}>Requests</NavLink>}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-muted sm:block">Hi, {user.name}</span>
              <button onClick={logout} className="hidden text-sm text-muted hover:text-cream sm:block">Logout</button>
              <Link to="/report" className="btn-gold flex items-center gap-2 py-2">
                <Plus size={17} /> Post item
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted hover:text-cream">Login</Link>
              <Link to="/register" className="btn-gold py-2">Join</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
