import { TipoPublicador } from './common';

export interface InformeMensualDto {
  idInformeMensual: string;
  idPublicador: string;
  nombrePublicador: string;
  idGrupo?: string;
  nombreGrupo: string;
  ano: number;
  mes: number;
  participo: boolean;
  cursosBiblicos: number;
  horas?: number;
  tipo: TipoPublicador;
  tipoDescripcion: string;
  inactivo: boolean;
  observacion?: string;
}

export interface RegistrarInformeDto {
  idPublicador: string;
  ano: number;
  mes: number;
  participo: boolean;
  cursosBiblicos: number;
  horas?: number;
  observacion?: string;
}

export interface ActualizarInformeDto {
  idInformeMensual: string;
  participo: boolean;
  cursosBiblicos: number;
  horas?: number;
  tipoInformativo?: TipoPublicador;
  inactivo: boolean;
  observacion?: string;
}

export interface ResumenTipoDto {
  cantidadInformes: number;
  cursosBiblicos: number;
}

export interface ResumenPrecursorDto {
  cantidadInformes: number;
  horas: number;
  cursosBiblicos: number;
}

export interface PromedioReunionDto {
  hayReuniones: boolean;
  cantidadReuniones: number;
  promedio: number;
}

export interface PendientesDto {
  reunionesRegistradas: boolean;
  gruposSinInforme: string[];
  publicadoresSinInformePorGrupo: Record<string, string[]>;
}

export interface TotalInformeDto {
  ano: number;
  mes: number;
  totalPublicadores: number;
  promedioReunionEntreSemana: PromedioReunionDto;
  promedioReunionFinSemana: PromedioReunionDto;
  publicadores: ResumenTipoDto;
  precursoresAuxiliares: ResumenPrecursorDto;
  precursoresRegulares: ResumenPrecursorDto;
  pendientes: PendientesDto;
}

export interface ResultadoImportacionDto {
  exitosos: number;
  fallidos: number;
  errores: string[];
}

export interface ImportarInformesDto {
  ano: number;
  mes: number;
  idGrupo: string;
}

export interface FiltrosInformeListado {
  ano?: number;
  mes?: number;
  idGrupo?: string;
  idPublicador?: string;
  tipo?: TipoPublicador;
  inactivo?: boolean;
  pagina: number;
  tamanoPagina: number;
}
