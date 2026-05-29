import { API_URL } from '@/constants';
import TarjetaViaje from '@/app/_components/TarjetaViaje';
import type { Ruta, Viaje } from '@/entities';
import { authHeaders } from '@/helpers/authHeaders';

type ViajeConRuta = Viaje & { ruta?: Ruta };

export default async function DashboardPage() {
  const response = await fetch(`${API_URL}/viajes`, {
    headers: await authHeaders(),
    cache: 'no-store',
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
            <TarjetaViaje key={viaje.id} viaje={viaje} />
          ))}
        </div>
      )}
    </div>
  );
}
