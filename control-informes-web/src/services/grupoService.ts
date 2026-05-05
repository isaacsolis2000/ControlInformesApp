import type { GrupoDto, CrearGrupoDto, ActualizarGrupoDto, AsignarPublicadoresDto, QuitarPublicadoresDto, MiembroGrupoDto } from '../types';
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export const grupoService = {
  getAll: () =>
    apiGet<GrupoDto[]>('/grupos'),

  getById: (id: string) =>
    apiGet<GrupoDto>(`/grupos/${id}`),

  crear: (dto: CrearGrupoDto) =>
    apiPost<string>('/grupos', dto),

  actualizar: (dto: ActualizarGrupoDto) =>
    apiPut<string>(`/grupos/`, dto),

  eliminar: (id: string) =>
    apiDelete<string>(`/grupos/${id}`),

  asignarPublicadores: (dto: AsignarPublicadoresDto) =>
    apiPost<string>('/grupos/asignar-publicadores', dto),

  getMiembros: (idGrupo: string) =>
    apiGet<MiembroGrupoDto[]>(`/grupos/${idGrupo}/miembros`),

  quitarPublicadores: (dto: QuitarPublicadoresDto) =>
    apiPost<string>('/grupos/quitar-publicadores', dto),
};
