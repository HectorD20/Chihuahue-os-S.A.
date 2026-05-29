import Link from 'next/link';
import { getSessionToken } from '@/helpers/session';
import BotonRegresar from '@/app/_components/BotonRegresar';
import MenuCuenta from '@/app/_components/MenuCuenta';

export default async function Cabecera() {
  const token = await getSessionToken();
  const autenticado = Boolean(token);

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <BotonRegresar />
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Chihuahueños S.A.
          </Link>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Cartelera
          </Link>

          <MenuCuenta autenticado={autenticado} />
        </nav>
      </div>
    </header>
  );
}
