import type {
  PublicadorDto,
  PublicadorGrupoDto,
  TarjetaPublicadorDto,
  CrearPublicadorDto,
  ActualizarPublicadorDto,
  FiltroPublicadorGrupoDto,
  PagedResult,
} from '../types';
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export const publicadoresService = {
  getAll: () =>
    apiGet<PublicadorDto[]>('/publicadores'),

  getSinGrupo: () =>
    apiGet<PublicadorDto[]>('/publicadores/sin-grupo'),

  getListado: (filtros: FiltroPublicadorGrupoDto) =>
    apiGet<PagedResult<PublicadorGrupoDto>>('/publicadores/listado', filtros as Record<string, unknown>),

  getById: (id: string) =>
    apiGet<PublicadorDto>(`/publicadores/${id}`),

  getTarjeta: (id: string, anoServicio?: number) =>
    apiGet<TarjetaPublicadorDto>(`/publicadores/${id}/tarjeta`, anoServicio ? { anoServicio } : undefined),

  crear: (dto: CrearPublicadorDto) =>
    apiPost<string>('/publicadores', dto),

  actualizar: (id: string, dto: ActualizarPublicadorDto) =>
    apiPut<string>(`/publicadores/${id}`, dto),

  eliminar: (id: string) =>
    apiDelete<string>(`/publicadores/${id}`),
};
