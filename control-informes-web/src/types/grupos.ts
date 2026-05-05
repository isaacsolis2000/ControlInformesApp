export interface GrupoDto {
  idGrupo: string;
  nombre: string;
  idCapitan: string;
  nombreCapitan: string;
  totalMiembros?: number;
}

export interface CrearGrupoDto {
  nombre: string;
  idCapitan: string;
}

export interface ActualizarGrupoDto {
  idGrupo: string;
  nombre: string;
  idCapitan: string;
}

export interface AsignarPublicadoresDto {
  idGrupo: string;
  idPublicadores: string[];
}

export interface QuitarPublicadoresDto {
  idGrupo: string;
  idPublicadores: string[];
}

export interface MiembroGrupoDto {
  idPublicador: string;
  nombreCompleto: string;
  tipoDescripcion: string;
  esCapitan: boolean;
}
