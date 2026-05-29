import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedRequest } from '@/common/interfaces/authenticated-request.interface';
import { RolUsuario } from '@/database/entities/usuario.entity';

export const MOCK_USUARIO_ID = '00000000-0000-4000-8000-000000000001';

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    request.user = {
      id: MOCK_USUARIO_ID,
      email: 'prueba@chihuahuenos.mx',
      role: RolUsuario.PASAJERO,
    };
    return true;
  }
}
