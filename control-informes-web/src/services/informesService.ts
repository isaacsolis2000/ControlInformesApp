import type { InformeMensual, InformeForm } from '../types';
import { apiGet, apiPost } from './apiClient';

export const informesService = {
  getAll: (ano: number, mes: number) =>
    apiGet<InformeMensual[]>('/informes', { ano, mes }),
  getHistorial: (idPublicador: string) =>
    apiGet<InformeMensual[]>(`/informes/historial/${idPublicador}`),
  create: (data: InformeForm) => apiPost<string>('/informes', {
    IdPublicador: data.idPublicador,
    Ano: data.ano,
    Mes: data.mes,
    Participo: data.participo,
    CursosBiblicos: data.cursosBiblicos,
    Horas: data.horas,
  }),
};
