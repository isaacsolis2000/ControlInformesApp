import { TipoReunion } from './common';

export interface AsistenciaDto {
  idAsistencia: string;
  fechaReunion: string;
  tipoReunion?: TipoReunion;
  tipoReunionDescripcion: string;
  cantidadPresencial: number;
  cantidadVirtual: number;
  total: number;
  observacion?: string;
}

export interface RegistrarAsistenciaDto {
  fechaReunion: string;
  tipoReunion: TipoReunion;
  cantidadPresencial: number;
  cantidadVirtual: number;
  observacion?: string;
}

export interface ActualizarAsistenciaDto {
  idAsistencia: string;
  fechaReunion: string;
  tipoReunion: TipoReunion;
  cantidadPresencial: number;
  cantidadVirtual: number;
  observacion?: string;
}

export interface RegistrarFechaDto {
  fechaReunion: string;
  observacion?: string;
}

export interface FiltrosAsistenciaListado {
  ano?: number;
  mes?: number;
  tipoReunion?: TipoReunion;
  pagina: number;
  tamanoPagina: number;
}
