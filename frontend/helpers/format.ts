export function formatearFecha(
  fecha: string,
  opciones: Intl.DateTimeFormatOptions = {
    dateStyle: 'full',
    timeStyle: 'short',
  },
): string {
  return new Intl.DateTimeFormat('es-MX', opciones).format(new Date(fecha));
}

export function formatearPrecio(precio: number | string): string {
  const valor = typeof precio === 'string' ? parseFloat(precio) : precio;

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(valor);
}

export function descripcionRuta(
  origen?: string,
  destino?: string,
  rutaId?: number,
): string {
  if (origen && destino) {
    return `${origen} → ${destino}`;
  }

  return `Ruta #${rutaId ?? '?'}`;
}
