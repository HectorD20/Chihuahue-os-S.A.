'use server';

import { revalidateTag } from 'next/cache';
import { API_URL } from '@/constants';
import { authHeaders } from '@/helpers/authHeaders';

type ConfirmarCompraResult =
  | { success: true }
  | { success: false; error: string };

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

export async function confirmarCompraBoleto(
  formData: FormData,
): Promise<ConfirmarCompraResult> {
  const tokenReserva = formData.get('token_reserva');
  const numeroAsiento = formData.get('numero_asiento');
  const identificacion = formData.get('identificacion');

  if (
    typeof tokenReserva !== 'string' ||
    !tokenReserva ||
    typeof numeroAsiento !== 'string' ||
    !numeroAsiento ||
    !(identificacion instanceof File) ||
    identificacion.size === 0
  ) {
    return {
      success: false,
      error: 'Completa el token, el asiento y sube tu identificación.',
    };
  }

  const cuerpo = new FormData();
  cuerpo.append('token_reserva', tokenReserva);
  cuerpo.append('numero_asiento', numeroAsiento);
  cuerpo.append('identificacion', identificacion);

  const headers = await authHeaders();
  const { 'Content-Type': _omitido, ...headersSinContentType } = headers;

  const response = await fetch(`${API_URL}/boletos/confirmar`, {
    method: 'POST',
    headers: headersSinContentType,
    body: cuerpo,
  });

  if (response.status === 200 || response.status === 201) {
    revalidateTag('viajes:boletos', 'max');
    return { success: true };
  }

  if (response.status === 410) {
    return {
      success: false,
      error: await mensajeError(
        response,
        'La reserva ha expirado. Selecciona un asiento nuevamente.',
      ),
    };
  }

  if (response.status === 409) {
    return {
      success: false,
      error: await mensajeError(
        response,
        'No se pudo confirmar la compra por un conflicto con el asiento.',
      ),
    };
  }

  return {
    success: false,
    error: await mensajeError(
      response,
      'No se pudo confirmar la compra. Intenta de nuevo más tarde.',
    ),
  };
}
