import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user, status } = useSelector((state) => state.auth);

  if (status === "idle") {
    return <div>Loading session...</div>; // or spinner
  }

  //Not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
