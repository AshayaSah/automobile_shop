import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // wait for auth to resolve

  if (isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
}
