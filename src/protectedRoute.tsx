import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const [authenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem("token");
    } catch {
      return false;
    }
  });

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
