'use server';

import { revalidatePath } from 'next/cache';
import { API_URL } from '@/constants';
import type { Ruta, Viaje } from '@/entities';
import { authHeaders } from '@/helpers/authHeaders';

type CrearRutaConViajeResult =
  | { success: true; data: { ruta: Ruta; viaje: Viaje } }
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

function revalidarCartelera() {
  revalidatePath('/dashboard/cuenta');
  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function crearRutaConViaje(
  formData: FormData,
): Promise<CrearRutaConViajeResult> {
  const origen = formData.get('origen');
  const destino = formData.get('destino');
  const fechaHoraInicio = formData.get('fecha_hora_inicio');
  const duracionRaw = formData.get('duracion');
  const precioRaw = formData.get('precio_boleto');

  if (typeof origen !== 'string' || !origen.trim()) {
    return { success: false, error: 'Ingresa la ciudad de origen.' };
  }

  if (typeof destino !== 'string' || !destino.trim()) {
    return { success: false, error: 'Ingresa la ciudad de destino.' };
  }

  if (typeof fechaHoraInicio !== 'string' || !fechaHoraInicio) {
    return { success: false, error: 'Selecciona la fecha y hora de salida.' };
  }

  const duracion = Number(duracionRaw);
  const precio_boleto = Number(precioRaw);

  if (!Number.isInteger(duracion) || duracion <= 0) {
    return { success: false, error: 'La duración debe ser un número entero positivo.' };
  }

  if (!Number.isFinite(precio_boleto) || precio_boleto <= 0) {
    return { success: false, error: 'Ingresa un precio válido para el boleto.' };
  }

  const headers = await authHeaders();

  const rutaResponse = await fetch(`${API_URL}/rutas`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      origen: origen.trim(),
      destino: destino.trim(),
    }),
  });

  if (!rutaResponse.ok) {
    if (rutaResponse.status === 401 || rutaResponse.status === 403) {
      return {
        success: false,
        error: 'No tienes permisos para crear rutas.',
      };
    }

    return {
      success: false,
      error: await mensajeError(
        rutaResponse,
        'No se pudo crear la ruta. Intenta de nuevo más tarde.',
      ),
    };
  }

  const ruta = (await rutaResponse.json()) as Ruta;

  const viajeResponse = await fetch(`${API_URL}/viajes`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ruta_id: ruta.id,
      fecha_hora_inicio: new Date(fechaHoraInicio).toISOString(),
      duracion,
      precio_boleto,
      capacidad: 40,
    }),
  });

  if (!viajeResponse.ok) {
    return {
      success: false,
      error: await mensajeError(
        viajeResponse,
        'La ruta se creó, pero no se pudo programar el viaje en la cartelera.',
      ),
    };
  }

  const viaje = (await viajeResponse.json()) as Viaje;
  revalidarCartelera();

  return { success: true, data: { ruta, viaje } };
}
