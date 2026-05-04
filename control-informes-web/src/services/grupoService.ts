import type { GrupoDto, CrearGrupoDto, ActualizarGrupoDto, AsignarPublicadoresDto } from '../types';
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export const grupoService = {
  getAll: () =>
    apiGet<GrupoDto[]>('/grupos'),

  getById: (id: string) =>
    apiGet<GrupoDto>(`/grupos/${id}`),

  crear: (dto: CrearGrupoDto) =>
    apiPost<string>('/grupos', dto),

  actualizar: (id: string, dto: ActualizarGrupoDto) =>
    apiPut<string>(`/grupos/${id}`, dto),

  eliminar: (id: string) =>
    apiDelete<string>(`/grupos/${id}`),

  asignarPublicadores: (dto: AsignarPublicadoresDto) =>
    apiPost<string>('/grupos/asignar-publicadores', dto),
};
