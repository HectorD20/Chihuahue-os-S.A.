import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@heroui/react';
import { API_URL } from '@/constants';
import BotonCerrarSesion from '@/app/dashboard/cuenta/_components/BotonCerrarSesion';
import FormularioNuevaRuta from '@/app/dashboard/cuenta/_components/FormularioNuevaRuta';
import type { BoletoCompra, PerfilUsuario } from '@/entities';
import { authHeaders } from '@/helpers/authHeaders';
import {
  descripcionRuta,
  formatearFecha,
  formatearPrecio,
} from '@/helpers/format';

export default async function CuentaPage() {
  const headers = await authHeaders();

  const [perfilRes, comprasRes] = await Promise.all([
    fetch(`${API_URL}/usuarios/me`, { headers, cache: 'no-store' }),
    fetch(`${API_URL}/usuarios/me/compras`, { headers, cache: 'no-store' }),
  ]);

  if (!perfilRes.ok) {
    throw new Error('No se pudo cargar tu perfil.');
  }

  const perfil = (await perfilRes.json()) as PerfilUsuario;
  const compras = comprasRes.ok
    ? ((await comprasRes.json()) as BoletoCompra[])
    : [];
  const esAdmin = perfil.role === 'ADMIN';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mi cuenta
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Consulta tu información personal y tu historial de compras.
          </p>
        </div>
        <BotonCerrarSesion />
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Información personal
        </h2>

        <Card>
          <CardHeader>
            <CardTitle>{perfil.nombre}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DatoPerfil etiqueta="Correo electrónico" valor={perfil.email} />
            <DatoPerfil etiqueta="Rol" valor={perfil.role} />
            <DatoPerfil
              etiqueta="Identificación verificada"
              valor={perfil.identificacion_url ? 'Sí' : 'Pendiente'}
            />
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Historial de compras
        </h2>

        {compras.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
            Aún no has comprado boletos. Explora la cartelera para reservar tu
            próximo viaje.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {compras.map((compra) => (
              <Card key={compra.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Asiento {compra.numero_asiento}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {compra.viaje?.ruta
                      ? descripcionRuta(
                          compra.viaje.ruta.origen,
                          compra.viaje.ruta.destino,
                        )
                      : `Viaje #${compra.viaje_id}`}
                  </p>
                  {compra.viaje ? (
                    <>
                      <p className="text-zinc-900 dark:text-zinc-50">
                        Salida:{' '}
                        {formatearFecha(compra.viaje.fecha_hora_inicio, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {formatearPrecio(compra.viaje.precio_boleto)}
                      </p>
                    </>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {esAdmin ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Panel de administrador
          </h2>
          <FormularioNuevaRuta />
        </section>
      ) : null}
    </div>
  );
}

function DatoPerfil({
  etiqueta,
  valor,
}: {
  etiqueta: string;
  valor: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {etiqueta}
      </p>
      <p className="text-base text-zinc-900 dark:text-zinc-50">{valor}</p>
    </div>
  );
}
