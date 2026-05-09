import type {
  AsistenciaDto,
  RegistrarAsistenciaDto,
  ActualizarAsistenciaDto,
  RegistrarFechaDto,
  FiltrosAsistenciaListado,
  PagedResult,
} from '../types';
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export const asistenciaService = {
  getListado: (filtros: FiltrosAsistenciaListado) =>
    apiGet<PagedResult<AsistenciaDto>>('/asistencia', filtros as Record<string, unknown>),

  getById: (id: string) =>
    apiGet<AsistenciaDto>(`/asistencia/${id}`),

  registrar: (dto: RegistrarAsistenciaDto) =>
    apiPost<string>('/asistencia', dto),

  registrarFecha: (dto: RegistrarFechaDto) =>
    apiPost<string>('/asistencia/fecha', dto),

  actualizar: (dto: ActualizarAsistenciaDto) =>
    apiPut<string>(`/asistencia}`, dto),

  eliminar: (id: string) =>
    apiDelete<string>(`/asistencia/${id}`),
};
