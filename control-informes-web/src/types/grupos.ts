export interface GrupoDto {
  idGrupo: string;
  nombre: string;
  idCapitan: string;
  nombreCapitan: string;
}

export interface CrearGrupoDto {
  nombre: string;
  idCapitan: string;
}

export interface ActualizarGrupoDto {
  nombre: string;
  idCapitan: string;
}

export interface AsignarPublicadoresDto {
  idGrupo: string;
  idPublicadores: string[];
}
