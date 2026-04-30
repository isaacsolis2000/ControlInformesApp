import type { Publicador, PublicadorForm, UpdatePublicadorForm, TarjetaPublicador } from '../types';
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export const publicadoresService = {
  getAll: () => apiGet<Publicador[]>('/publicadores'),
  getById: (id: string) => apiGet<Publicador>(`/publicadores/${id}`),
  create: (data: PublicadorForm) => apiPost<string>('/publicadores', {
    NombreCompleto: data.nombreCompleto,
    FechaNacimiento: data.fechaNacimiento,
    FechaBautismo: data.fechaBautismo,
    Tipo: data.tipo,
  }),
  update: (id: string, data: UpdatePublicadorForm) => apiPut<string>(`/publicadores/${id}`, {
    IdPublicador: data.idPublicador,
    NombreCompleto: data.nombreCompleto,
    FechaNacimiento: data.fechaNacimiento,
    FechaBautismo: data.fechaBautismo,
    Tipo: data.tipo,
    Activo: data.activo,
  }),
  delete: (id: string) => apiDelete<string>(`/publicadores/${id}`),
  getTarjeta: (id: string, anoServicio?: number) =>
    apiGet<TarjetaPublicador>(`/publicadores/${id}/tarjeta`, anoServicio ? { anoServicio } : undefined),
};
