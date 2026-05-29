import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@heroui/react';
import type { Ruta, Viaje } from '@/entities';
import {
  descripcionRuta,
  formatearFecha,
  formatearPrecio,
} from '@/helpers/format';

type ViajeConRuta = Viaje & { ruta?: Ruta };

interface TarjetaViajeProps {
  viaje: ViajeConRuta;
}

export default function TarjetaViaje({ viaje }: TarjetaViajeProps) {
  const rutaTexto = viaje.ruta
    ? descripcionRuta(viaje.ruta.origen, viaje.ruta.destino)
    : descripcionRuta(undefined, undefined, viaje.ruta_id);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Viaje #{viaje.id}</CardTitle>
        <CardDescription>{rutaTexto}</CardDescription>
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
        <Link
          href={`/dashboard/viajes/${viaje.id}`}
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Seleccionar Asientos
        </Link>
      </CardFooter>
    </Card>
  );
}
