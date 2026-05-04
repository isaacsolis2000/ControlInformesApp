export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface TokenDto {
  token: string;
  expiracion: string;
}
