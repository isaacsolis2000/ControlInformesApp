import type { TotalInformeDto } from '../types';
import { apiGet } from './apiClient';

export const reportesService = {
  getResumenMensual: (ano: number, mes: number) =>
    apiGet<TotalInformeDto>('/informes/total', { ano, mes }),
};
