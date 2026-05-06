import type { DashboardDto } from '../types';
import { apiGet } from './apiClient';

export const dashboardService = {
  getDashboard: (anoServicio: number, mes?: number) => {
    const params: Record<string, unknown> = { anoServicio };
    if (mes !== undefined && mes !== null) params.mes = mes;
    return apiGet<DashboardDto>('/dashboard', params);
  },
};
