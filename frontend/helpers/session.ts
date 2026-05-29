import { cookies } from 'next/headers';
import { cache } from 'react';
import { TOKEN_NAME } from '@/constants';
import type { RolUsuario } from '@/entities';

export interface JwtPayload {
  sub: string;
  email: string;
  role: RolUsuario;
  iat?: number;
  exp?: number;
}

export function decodeJwtPayload(token: string): JwtPayload {
  const [, payloadSegment] = token.split('.');

  if (!payloadSegment) {
    throw new Error('Token JWT inválido');
  }

  const json = Buffer.from(payloadSegment, 'base64url').toString('utf-8');
  return JSON.parse(json) as JwtPayload;
}

export const getSessionToken = cache(async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value ?? null;
});

export const getSessionRole = cache(async (): Promise<RolUsuario | null> => {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  try {
    return decodeJwtPayload(token).role;
  } catch {
    return null;
  }
});
