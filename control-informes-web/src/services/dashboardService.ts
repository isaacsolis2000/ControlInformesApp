import { apiClient } from './apiClient';

export interface DashboardKpis {
  TotalPublicadoresActivos: number;
  InformesRecibidos: number;
  TotalCursosBiblicos: number;
  TotalHorasPrecursores: number;
  PromedioAsistencia: number;
}

export interface DashboardTiposPublicador {
  Publicadores: number;
  PrecursoresAuxiliares: number;
  PrecursoresRegulares: number;
}

export interface DashboardDistribucion {
  Tipo: string;
  Informes: number;
  Cursos: number;
  Horas: number;
}

export interface DashboardHistorialSemestral {
  Mes: string;
  Ano: number;
  PublicadoresActivos: number;
  Informes: number;
  Cursos: number;
  Horas: number;
}

export interface DashboardVariaciones {
  CambioInformes: number;
  CambioCursos: number;
  CambioHoras: number;
  CambioAsistencia: number;
}

export interface DashboardDto {
  Ano: number;
  Mes: number;
  Kpis: DashboardKpis;
  TiposPublicador: DashboardTiposPublicador;
  Distribucion: DashboardDistribucion[];
  HistorialSemestral: DashboardHistorialSemestral[];
  Variaciones: DashboardVariaciones;
}

export interface ApiResponse<T> {
  HttpCode: number;
  HasError: boolean;
  Mensaje: string;
  Result: T;
}

export const dashboardService = {
  async getDashboard(ano: number, mes: number) {
    const res = await apiClient.get<ApiResponse<DashboardDto>>(`/api/dashboard?ano=${ano}&mes=${mes}`);
    return res.data.Result;
  },
};
