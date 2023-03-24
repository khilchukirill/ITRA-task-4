import { Navigate } from "react-router-dom";

export function ProtectedRoutes({ children }: any) {
  const token = localStorage.getItem("token");
  if (token && token !== "undefined") {
    return children;
  } else {
    return <Navigate to="/signIn" />;
  }
}
