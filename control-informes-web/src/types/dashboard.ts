export interface CardInformesDto {
  cantidadInformes: number;
  variacion: number;
}

export interface CardReunionDto {
  cantidadReuniones: number;
  promedio: number;
  variacion: number;
}

export interface DistribucionTipoDto {
  tipo: string;
  cantidad: number;
}

export interface HistorialMesDto {
  ano: number;
  mes: string;
  publicadores: number;
  precursoresAuxiliares: number;
  precursoresRegulares: number;
}

export interface DashboardDto {
  ano: number;
  mes: number;
  totalPublicadoresActivos: number;
  totalInactivos: number;
  publicadores: CardInformesDto;
  precursoresAuxiliares: CardInformesDto;
  precursoresRegulares: CardInformesDto;
  reunionesPublicas: CardReunionDto;
  reunionesServicio: CardReunionDto;
  distribucionPorTipo: DistribucionTipoDto[];
  historialSemestral: HistorialMesDto[];
}
