'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_URL, TOKEN_NAME } from '@/constants';
import { decodeJwtPayload } from '@/helpers/session';

type RegisterError = { success: false; error: string };

async function mensajeError(
  response: Response,
  mensajePorDefecto: string,
): Promise<string> {
  try {
    const body = (await response.json()) as {
      message?: string | string[];
    };

    if (typeof body.message === 'string') {
      return body.message;
    }

    if (Array.isArray(body.message)) {
      return body.message.join(', ');
    }
  } catch {
    // respuesta sin JSON
  }

  return mensajePorDefecto;
}

export async function registrarUsuario(
  formData: FormData,
): Promise<RegisterError | void> {
  const nombre = formData.get('nombre');
  const email = formData.get('email');
  const password = formData.get('password');
  const redirectTo = formData.get('redirect');

  if (typeof nombre !== 'string' || !nombre.trim()) {
    return { success: false, error: 'Ingresa tu nombre completo.' };
  }

  if (typeof email !== 'string' || !email.trim()) {
    return { success: false, error: 'Ingresa tu correo electrónico.' };
  }

  if (typeof password !== 'string' || password.length < 6) {
    return {
      success: false,
      error: 'La contraseña debe tener al menos 6 caracteres.',
    };
  }

  const registerResponse = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: nombre.trim(),
      email: email.trim(),
      password,
    }),
  });

  if (!registerResponse.ok) {
    if (registerResponse.status === 409) {
      return {
        success: false,
        error: 'Este correo ya está registrado. Inicia sesión en su lugar.',
      };
    }

    return {
      success: false,
      error: await mensajeError(
        registerResponse,
        'No se pudo crear la cuenta. Intenta de nuevo más tarde.',
      ),
    };
  }

  const loginResponse = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  if (!loginResponse.ok) {
    redirect('/login');
  }

  const body = (await loginResponse.json()) as { access_token?: string };

  if (!body.access_token) {
    redirect('/login');
  }

  try {
    decodeJwtPayload(body.access_token);
  } catch {
    return {
      success: false,
      error: 'Cuenta creada, pero no se pudo iniciar sesión automáticamente.',
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

  redirect('/dashboard/cuenta');
}
