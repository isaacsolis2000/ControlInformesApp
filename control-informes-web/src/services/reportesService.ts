import type { ResumenMensual } from '../types';
import { apiGet } from './apiClient';

export const reportesService = {
  getResumenMensual: (ano: number, mes: number) =>
    apiGet<ResumenMensual>('/reportes/resumen-mensual', { ano, mes }),
};
