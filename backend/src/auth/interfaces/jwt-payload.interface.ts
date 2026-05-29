import { RolUsuario } from '@/database/entities/usuario.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: RolUsuario;
}
