export interface ApiResponse<T> {
  httpCode: number;
  result: T | null;
  hasError: boolean;
  mensaje: string;
  codigoError: string | null;
  errores: string[] | null;
}

export type TipoPublicador = 'Publicador' | 'PrecursorAuxiliar' | 'PrecursorRegular';

export type TipoReunion = 'EntreSemanana' | 'FinDeSemana';

export interface Publicador {
  idPublicador: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  fechaBautismo: string | null;
  tipo: TipoPublicador;
  activo: boolean;
}

export interface PublicadorForm {
  nombreCompleto: string;
  fechaNacimiento: string;
  fechaBautismo: string | null;
  tipo: TipoPublicador;
}

export interface UpdatePublicadorForm {
  idPublicador: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  fechaBautismo: string | null;
  tipo: TipoPublicador;
  activo: boolean;
}

export interface TarjetaMes {
  ano: number;
  mes: number;
  participo: boolean;
  cursosBiblicos: number;
  horas: number | null;
  notas: string | null;
}

export interface TarjetaPublicador {
  idPublicador: string;
  nombreCompleto: string;
  anoServicioInicio: number;
  anoServicioFin: number;
  meses: TarjetaMes[];
}

export interface InformeMensual {
  idInformeMensual: string;
  idPublicador: string;
  nombrePublicador: string;
  ano: number;
  mes: number;
  participo: boolean;
  cursosBiblicos: number;
  horas: number | null;
  tipo: TipoPublicador;
}

export interface InformeForm {
  idPublicador: string;
  ano: number;
  mes: number;
  participo: boolean;
  cursosBiblicos: number;
  horas: number | null;
}

export interface Asistencia {
  idAsistencia: string;
  fecha: string;
  tipoReunion: TipoReunion;
  cantidad: number;
}

export interface AsistenciaForm {
  fecha: string;
  tipoReunion: TipoReunion;
  cantidad: number;
}

export interface ResumenGrupo {
  total: number;
  informaron: number;
  cursosBiblicos: number;
  horas: number;
}

export interface ResumenMensual {
  ano: number;
  mes: number;
  totalPublicadoresActivos: number;
  cantidadInformes: number;
  totalCursosBiblicos: number;
  totalHorasPrecursores: number;
  promedioAsistencia: number;
  publicadores: ResumenGrupo;
  precursoresAuxiliares: ResumenGrupo;
  precursoresRegulares: ResumenGrupo;
}

export interface ImportResult {
  totalProcesados: number;
  exitosos: number;
  fallidos: number;
  errores: string[];
}
