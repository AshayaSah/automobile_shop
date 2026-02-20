import api from "./axios";

// ── Shapes ──────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ── Calls ────────────────────────────────────────────────
export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>("/auth/login", credentials),

  register: (credentials: RegisterCredentials) =>
    api.post<AuthResponse>("/users/register", credentials),

  logout: () => api.post("/auth/logout"),

  getMe: () => api.get<User>("/auth/me"),
};
