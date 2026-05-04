import type { DashboardDto } from '../types';
import { apiGet } from './apiClient';

export const dashboardService = {
  getDashboard: (ano: number, mes: number) =>
    apiGet<DashboardDto>('/dashboard', { ano, mes }),
};
