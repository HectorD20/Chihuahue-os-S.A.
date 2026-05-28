import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { AuthenticatedRequest } from '@/common/interfaces/authenticated-request.interface';

interface JwtPayload {
  sub: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token ausente o inválido');
    }

    const token = authHeader.slice(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new UnauthorizedException('Configuración JWT inválida');
    }

    try {
      const payload = verify(token, secret) as JwtPayload;
      request.user = { id: payload.sub };
      return true;
    } catch {
      throw new UnauthorizedException('Token ausente o inválido');
    }
  }
}
