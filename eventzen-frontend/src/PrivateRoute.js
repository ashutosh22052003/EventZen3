import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./utils/auth";
function PrivateRoute() {
  const { token } = useAuth();
  
  return token ? <Outlet /> : <Navigate to="/login" />;
}

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
