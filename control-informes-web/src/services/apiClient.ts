import axios, { AxiosError } from 'axios';
import type { ApiResponse } from '../types';
import { useNotificationStore } from '../stores/notificationStore';

const API_BASE_URL = 'https://localhost:7144/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach stored JWT token to every request
apiClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { token?: string } };
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown>;
    if (data.hasError) {
      const store = useNotificationStore.getState();
      store.showNotification(data.mensaje || 'Error en la operación', 'error');
      return Promise.reject(new Error(data.mensaje));
    }
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const store = useNotificationStore.getState();
    const mensaje = error.response?.data?.mensaje || 'Error de conexión con el servidor';
    store.showNotification(mensaje, 'error');
    return Promise.reject(error);
  }
);

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url, { params });
  return response.data.result as T;
}

export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(url, data);
  return response.data.result as T;
}

export async function apiPut<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.put<ApiResponse<T>>(url, data);
  return response.data.result as T;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const response = await apiClient.delete<ApiResponse<T>>(url);
  return response.data.result as T;
}

export async function apiPostFormData<T>(url: string, formData: FormData): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.result as T;
}

export async function apiGetBlob(url: string): Promise<Blob> {
  const response = await apiClient.get(url, { responseType: 'blob' });
  return response.data;
}

export default apiClient;
