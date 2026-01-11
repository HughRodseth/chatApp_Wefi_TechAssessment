// src/routes/ProtectedRoute.tsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // While we’re restoring/validating the session
    return <div>Checking session...</div>;
  }

  if (!user) {
    // Not logged in: send to /login, remember where they tried to go
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // Session is valid, render nested route
  return <Outlet />;
}
