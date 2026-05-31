import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return <p className="p-8 text-muted">Checking login...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
