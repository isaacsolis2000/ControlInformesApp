import { apiPost } from '../../../services/apiClient';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

interface TokenResult {
  token: string;
  expiracion: string;
}

interface JwtPayload {
  sub?: string;
  unique_name?: string;
  role?: string;
  [key: string]: unknown;
}

function decodeJwtPayload(token: string): JwtPayload {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return {};
  }
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const result = await apiPost<TokenResult>('/auth/login', {
      Username: credentials.username,
      Password: credentials.password,
    });

    const payload = decodeJwtPayload(result.token);
    const user: AuthUser = {
      id: payload.sub ?? '',
      username: payload.unique_name ?? credentials.username,
      name: payload.unique_name ?? credentials.username,
      role: typeof payload.role === 'string' ? payload.role : 'admin',
    };

    return { user, token: result.token };
  },

  logout: () => {
    // Token is managed by zustand/persist — nothing extra needed
  },

  getStoredToken: (): string | null => {
    try {
      const raw = localStorage.getItem('auth-storage');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { state?: { token?: string } };
      return parsed?.state?.token ?? null;
    } catch {
      return null;
    }
  },
};
