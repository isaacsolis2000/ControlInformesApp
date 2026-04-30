import type { Asistencia, AsistenciaForm } from '../types';
import { apiGet, apiPost } from './apiClient';

export const asistenciaService = {
  getAll: (fechaInicio: string, fechaFin: string) =>
    apiGet<Asistencia[]>('/asistencia', { fechaInicio, fechaFin }),
  create: (data: AsistenciaForm) => apiPost<string>('/asistencia', {
    Fecha: data.fecha,
    TipoReunion: data.tipoReunion,
    Cantidad: data.cantidad,
  }),
};
