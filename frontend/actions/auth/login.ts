'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_URL, TOKEN_NAME } from '@/constants';
import { decodeJwtPayload } from '@/helpers/session';

type LoginError = { success: false; error: string };

function rutaTrasLogin(): string {
  return '/dashboard/cuenta';
}

export async function loginUsuario(
  formData: FormData,
): Promise<LoginError | void> {
  const email = formData.get('email');
  const password = formData.get('password');
  const redirectTo = formData.get('redirect');

  if (typeof email !== 'string' || !email.trim()) {
    return { success: false, error: 'Ingresa tu correo electrónico.' };
  }

  if (typeof password !== 'string' || !password) {
    return { success: false, error: 'Ingresa tu contraseña.' };
  }

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  if (!response.ok) {
    return {
      success: false,
      error: 'Credenciales inválidas. Verifica tu correo y contraseña.',
    };
  }

  const body = (await response.json()) as { access_token?: string };

  if (!body.access_token) {
    return {
      success: false,
      error: 'El servidor no devolvió un token de sesión válido.',
    };
  }

  try {
    decodeJwtPayload(body.access_token);
  } catch {
    return {
      success: false,
      error: 'No se pudo validar la sesión recibida del servidor.',
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, body.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  if (
    typeof redirectTo === 'string' &&
    redirectTo.startsWith('/dashboard') &&
    !redirectTo.startsWith('//')
  ) {
    redirect(redirectTo);
  }

  redirect(rutaTrasLogin());
}
