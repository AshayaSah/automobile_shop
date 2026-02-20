import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import {
  authApi,
  type LoginCredentials,
  type RegisterCredentials,
  type User,
} from "../api/auth.api";

// ── Types ────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// ── Context ──────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// ── Provider ─────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(
    !!localStorage.getItem("token"),
  );

  // Keep localStorage in sync with token state
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // On mount — if a token exists, validate it  and load the user
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const { data } = await authApi.getMe();
        setUser(data);
      } catch {
        // Token expired or invalid — force clean state
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { data } = await authApi.login(credentials);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const { data } = await authApi.register(credentials);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      // Always clear local state even if the server call fails
      setToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
