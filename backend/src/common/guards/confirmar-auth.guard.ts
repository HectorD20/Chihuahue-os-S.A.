import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { MockAuthGuard } from '@/common/guards/mock-auth.guard';

@Injectable()
export class ConfirmarAuthGuard implements CanActivate {
  constructor(private readonly jwtAuthGuard: JwtAuthGuard) {}

  private readonly mockGuard = new MockAuthGuard();

  canActivate(context: ExecutionContext): boolean {
    if (process.env.NODE_ENV === 'production') {
      return this.jwtAuthGuard.canActivate(context);
    }

    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
    }>();

    if (request.headers.authorization?.startsWith('Bearer ')) {
      return this.jwtAuthGuard.canActivate(context);
    }

    return this.mockGuard.canActivate(context);
  }
}
