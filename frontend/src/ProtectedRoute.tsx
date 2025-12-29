import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();


  if (!isAuthenticated) {
    // User not logged in → send them to login
    return <Navigate to="/" replace />; // "We use <Navigate> instead of useNavigate inside a ProtectedRoute because useNavigate performs an immediate, imperative redirect, 
    // which is a side effect that React does not allow during rendering.
    //  <Navigate> is declarative — it tells React Router to render a redirect as part of the render tree, keeping React’s render process pure and predictable."
  }

  // User logged in → render the page
  return children;
}

export default ProtectedRoute;
