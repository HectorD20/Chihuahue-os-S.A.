import { Request } from 'express';
import { RolUsuario } from '@/database/entities/usuario.entity';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: RolUsuario;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
