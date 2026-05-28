import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@heroui/react';
import { API_URL } from '@/constants';
import type { Ruta, Viaje } from '@/entities';
import { authHeaders } from '@/helpers/authHeaders';

type ViajeConRuta = Viaje & { ruta?: Ruta };

function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(fecha));
}

function formatearPrecio(precio: number | string): string {
  const valor = typeof precio === 'string' ? parseFloat(precio) : precio;

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(valor);
}

function descripcionRuta(viaje: ViajeConRuta): string {
  if (viaje.ruta) {
    return `${viaje.ruta.origen} → ${viaje.ruta.destino}`;
  }

  return `Ruta #${viaje.ruta_id}`;
}

export default async function DashboardPage() {
  const response = await fetch(`${API_URL}/viajes`, {
    headers: await authHeaders(),
  });

  const viajes = (await response.json()) as ViajeConRuta[];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Próximos Viajes Disponibles
        </h1>
      </header>

      {viajes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
          No hay rutas programadas en este momento. Vuelve pronto para consultar
          nuevos viajes.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {viajes.map((viaje) => (
            <Card key={viaje.id} className="h-full">
              <CardHeader>
                <CardTitle>Viaje #{viaje.id}</CardTitle>
                <CardDescription>{descripcionRuta(viaje)}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Salida
                  </p>
                  <p className="text-base text-zinc-900 dark:text-zinc-50">
                    {formatearFecha(viaje.fecha_hora_inicio)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Precio del boleto
                  </p>
                  <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatearPrecio(viaje.precio_boleto)}
                  </p>
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/dashboard/viajes/${viaje.id}`} className="w-full">
                  <Button variant="primary" fullWidth>
                    Seleccionar Asientos
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
