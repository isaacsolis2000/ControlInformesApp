export interface ApiResponse<T> {
  httpCode: number;
  result: T | null;
  hasError: boolean;
  mensaje: string;
  codigoError: string | null;
  errores: string[] | null;
}

export interface PagedResult<T> {
  items: T[];
  totalRegistros: number;
  pagina: number;
  tamanoPagina: number;
  totalPaginas: number;
}

export enum TipoPublicador {
  Publicador = 0,
  NoBautizado = 1,
  PrecursorAuxiliar = 2,
  PrecursorRegular = 3,
}

export enum TipoReunion {
  Publica = 0,
  EntreSemana = 1,
}

export enum Genero {
  Hombre = 0,
  Mujer = 1,
}

export enum CondicionEspiritual {
  OtrasOvejas = 0,
  Ungido = 1,
}

export enum RolCongregacion {
  Ninguno = 0,
  SiervoMinisterial = 1,
  Anciano = 2,
}

export enum TipoResumenPublicador {
  Publicador = 0,
  PrecursorAuxiliar = 1,
  PrecursorRegular = 2,
}
