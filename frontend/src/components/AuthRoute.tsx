import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useAuth from "@/domain/useAuth";

function AuthRoute({ children }) {
  const { isAuth } = useAuth();

  if (!isAuth) return <Navigate to="/" />;

  return children;
}

export default AuthRoute;
