import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { AuthenticatedRequest } from '@/common/interfaces/authenticated-request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token ausente o inválido');
    }

    const token = authHeader.slice(7);

    if (!process.env.JWT_SECRET) {
      throw new UnauthorizedException('Configuración JWT inválida');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Token ausente o inválido');
    }
  }
}
