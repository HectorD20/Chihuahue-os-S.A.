import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@heroui/react';
import { API_URL } from '@/constants';
import type { Ruta, Viaje } from '@/entities';

const rutasDestacadas = [
  { origen: 'Oaxaca', destino: 'Puebla' },
  { origen: 'Chihuahua', destino: 'Nuevo León' },
  { origen: 'Baja California Norte', destino: 'Baja California Sur' },
  { origen: 'Chihuahua', destino: 'CDMX' },
];

type ViajeConRuta = Viaje & { ruta?: Ruta };

function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
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

function buscarViaje(
  viajes: ViajeConRuta[],
  origen: string,
  destino: string,
): ViajeConRuta | undefined {
  return viajes.find(
    (viaje) =>
      viaje.ruta?.origen === origen && viaje.ruta?.destino === destino,
  );
}

export default async function Home() {
  const response = await fetch(`${API_URL}/viajes`, {
    next: { revalidate: 60 },
  });

  const viajes = response.ok
    ? ((await response.json()) as ViajeConRuta[])
    : [];

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 px-6 py-20 text-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
              Transporte interestatal
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              Chihuahueños S.A. de C.V.
            </h1>
            <p className="max-w-2xl text-lg text-blue-100">
              Compra boletos de autobús entre estados con selección de asientos
              en tiempo real y reserva segura mientras completas tu compra.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 min-w-44 items-center justify-center rounded-xl bg-white px-6 text-base font-semibold text-blue-800 transition-colors hover:bg-blue-50"
            >
              Ver cartelera
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16">
        <header className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Rutas disponibles
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Selecciona una ruta para ver horarios y comprar boletos.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rutasDestacadas.map((ruta) => {
            const viaje = buscarViaje(viajes, ruta.origen, ruta.destino);

            return (
              <Card key={`${ruta.origen}-${ruta.destino}`} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {ruta.origen} → {ruta.destino}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Autobuses con 40 asientos, reserva temporal de 10 minutos y
                    verificación de identidad al confirmar la compra.
                  </p>

                  {viaje ? (
                    <>
                      <div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                          Próxima salida
                        </p>
                        <p className="text-base text-zinc-900 dark:text-zinc-50">
                          {formatearFecha(viaje.fecha_hora_inicio)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                          Precio desde
                        </p>
                        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                          {formatearPrecio(viaje.precio_boleto)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      No hay viajes programados por el momento.
                    </p>
                  )}
                </CardContent>

                <CardFooter>
                  {viaje ? (
                    <Link
                      href={`/dashboard/viajes/${viaje.id}`}
                      className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      Comprar boletos
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                    >
                      Ver cartelera
                    </Link>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 px-6 py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-3">
          <Paso
            titulo="1. Elige tu viaje"
            descripcion="Explora la cartelera y selecciona origen, destino y horario."
          />
          <Paso
            titulo="2. Reserva tu asiento"
            descripcion="El asiento queda bloqueado 10 minutos mientras completas la compra."
          />
          <Paso
            titulo="3. Confirma con identificación"
            descripcion="Sube tu INE o identificación oficial (PDF, PNG o JPG) para finalizar."
          />
        </div>
      </section>
    </div>
  );
}

function Paso({
  titulo,
  descripcion,
}: {
  titulo: string;
  descripcion: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{titulo}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{descripcion}</p>
    </div>
  );
}
