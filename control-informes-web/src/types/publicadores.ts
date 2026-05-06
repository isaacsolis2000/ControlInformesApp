import { TipoPublicador, Genero, CondicionEspiritual, RolCongregacion } from './common';

export interface PublicadorDto {
  idPublicador: string;
  nombreCompleto: string;
  fechaNacimiento?: string;
  fechaBautismo?: string;
  genero: Genero;
  generoDescripcion: string;
  condicionEspiritual: CondicionEspiritual;
  condicionEspiritualDescripcion: string;
  tipo: TipoPublicador;
  tipoDescripcion: string;
  rol: RolCongregacion;
  rolDescripcion: string;
  idGrupo?: string;
  nombreGrupo: string;
  inactivo: boolean;
  activo: boolean;
  fechaCreacion: string;
}

export interface PublicadorGrupoDto {
  idPublicador: string;
  nombrePublicador: string;
  tipo: TipoPublicador;
  tipoDescripcion: string;
  idGrupo?: string;
  nombreGrupo: string;
  esCapitan: boolean;
  inactivo: boolean;
}

export interface TarjetaMesDto {
  ano: number;
  mes: number;
  participo: boolean;
  cursosBiblicos: number;
  horas?: number;
  observacion?: string;
}

export interface TarjetaPublicadorDto {
  idPublicador: string;
  nombreCompleto: string;
  tipo: TipoPublicador;
  anoServicioInicio: number;
  anoServicioFin: number;
  meses: TarjetaMesDto[];
}

export interface CrearPublicadorDto {
  nombreCompleto: string;
  fechaNacimiento?: string;
  fechaBautismo?: string;
  genero: Genero;
  condicionEspiritual: CondicionEspiritual;
  tipo: TipoPublicador;
  rol: RolCongregacion;
  idGrupo?: string;
  inactivo: boolean;
}

export interface ActualizarPublicadorDto {
  idPublicador: string;
  nombreCompleto: string;
  fechaNacimiento?: string;
  fechaBautismo?: string;
  genero: Genero;
  condicionEspiritual: CondicionEspiritual;
  tipo: TipoPublicador;
  rol: RolCongregacion;
  idGrupo?: string;
  inactivo: boolean;
}

export interface FiltrosPublicadorListado {
  idGrupo?: string;
  idPublicador?: string;
  nombreCompleto?: string;
  tipo?: TipoPublicador;
  inactivo?: boolean;
  pagina: number;
  tamanoPagina: number;
}

export interface FiltroPublicadorGrupoDto {
  idGrupo?: string;
  idPublicador?: string;
  nombreCompleto?: string;
  tipo?: TipoPublicador;
  inactivo?: boolean;
  pagina: number;
  tamanoPagina: number;
}

export interface ResultadoImportacionTarjetasDto {
  exitosos: number;
  fallidos: number;
  errores: string[];
  creados: string[];
  actualizados: string[];
}
