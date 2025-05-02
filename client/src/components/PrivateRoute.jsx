import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function PrivateRoute() {
  const { user } = useAuth();
  console.log(user);
  return user ? <Outlet /> : <Navigate to="/home" />;
}
