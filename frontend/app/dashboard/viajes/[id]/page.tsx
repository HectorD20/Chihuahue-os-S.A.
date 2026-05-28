import MapaAutobus from '@/app/dashboard/viajes/[id]/_components/MapaAutobus';
import { API_URL } from '@/constants';
import type { Boleto } from '@/entities';
import { authHeaders } from '@/helpers/authHeaders';

export default async function ViajePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(`${API_URL}/viajes/${id}/boletos`, {
    headers: await authHeaders(),
    next: { tags: ['viajes:boletos'] },
  });

  const boletos = (await response.json()) as Boleto[];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Selección de Asientos - Viaje #{id}
        </h1>
      </header>

      <MapaAutobus boletos={boletos} />
    </div>
  );
}
