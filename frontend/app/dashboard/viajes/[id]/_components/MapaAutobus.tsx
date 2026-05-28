'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, toast } from '@heroui/react';
import { reservarBoleto } from '@/actions/boletos/reservar';
import FormularioConfirmar from '@/app/dashboard/viajes/[id]/_components/FormularioConfirmar';
import type { Boleto } from '@/entities';

const ASIENTOS_POR_FILA = 4;
const TOTAL_ASIENTOS = 40;

interface MapaAutobusProps {
  boletos: Boleto[];
}

function asientoDeshabilitado(boleto: Boleto): boolean {
  return boleto.estado === 'COMPRADO' || boleto.estado === 'RESERVADO';
}

function clasesAsiento(boleto: Boleto, seleccionado: Boleto | null): string {
  if (seleccionado?.id === boleto.id) {
    return 'bg-blue-500 text-white ring-2 ring-blue-300';
  }

  switch (boleto.estado) {
    case 'COMPRADO':
      return 'bg-red-500 text-white cursor-not-allowed opacity-90';
    case 'RESERVADO':
      return 'bg-yellow-400 text-zinc-900 cursor-not-allowed opacity-90';
    case 'DISPONIBLE':
      return 'bg-green-500 text-white hover:bg-green-600 cursor-pointer';
    default:
      return 'bg-zinc-300 text-zinc-700';
  }
}

export default function MapaAutobus({ boletos }: MapaAutobusProps) {
  const router = useRouter();
  const [asientoSeleccionado, setAsientoSeleccionado] = useState<Boleto | null>(
    null,
  );
  const [tokenReserva, setTokenReserva] = useState<string | null>(null);
  const [numeroAsientoReservado, setNumeroAsientoReservado] = useState<
    number | null
  >(null);
  const [isPending, startTransition] = useTransition();

  const limpiarReserva = () => {
    setTokenReserva(null);
    setNumeroAsientoReservado(null);
  };

  const boletosPorAsiento = useMemo(() => {
    const mapa = new Map<number, Boleto>();
    for (const boleto of boletos) {
      mapa.set(boleto.numero_asiento, boleto);
    }
    return mapa;
  }, [boletos]);

  const filas = useMemo(() => {
    const totalFilas = TOTAL_ASIENTOS / ASIENTOS_POR_FILA;
    return Array.from({ length: totalFilas }, (_, indiceFila) => {
      const inicio = indiceFila * ASIENTOS_POR_FILA + 1;
      return [inicio, inicio + 1, inicio + 2, inicio + 3].map(
        (numero) => boletosPorAsiento.get(numero) ?? null,
      );
    });
  }, [boletosPorAsiento]);

  const handleSeleccionarAsiento = (boleto: Boleto) => {
    if (asientoDeshabilitado(boleto)) {
      return;
    }

    setAsientoSeleccionado((actual) =>
      actual?.id === boleto.id ? null : boleto,
    );
  };

  const handleConfirmar = () => {
    if (!asientoSeleccionado) {
      return;
    }

    startTransition(async () => {
      const resultado = await reservarBoleto(asientoSeleccionado.id);

      if (resultado.success) {
        setTokenReserva(resultado.data.token_reserva ?? null);
        setNumeroAsientoReservado(resultado.data.numero_asiento);
        setAsientoSeleccionado(null);
        toast.success('Asiento reservado correctamente.', {
          description: resultado.data.token_reserva
            ? `Token de reserva: ${resultado.data.token_reserva}`
            : 'Tu reserva quedó registrada.',
        });
        router.refresh();
        return;
      }

      setAsientoSeleccionado(null);
      toast.danger('No se pudo confirmar la selección', {
        description: resultado.error,
      });
      router.refresh();
    });
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 text-center text-sm font-medium text-zinc-500">
          Frente del autobús
        </div>

        <div className="flex flex-col gap-3">
          {filas.map((asientosFila, indiceFila) => (
            <div
              key={indiceFila}
              className="grid grid-cols-[1fr_1fr_2rem_1fr_1fr] items-center gap-2"
            >
              {asientosFila.slice(0, 2).map((boleto, indice) => (
                <Asiento
                  key={boleto?.id ?? `izquierda-${indiceFila}-${indice}`}
                  boleto={boleto}
                  seleccionado={asientoSeleccionado}
                  onSeleccionar={handleSeleccionarAsiento}
                />
              ))}

              <div
                aria-hidden
                className="h-10 rounded-sm border border-dashed border-zinc-300 dark:border-zinc-700"
              />

              {asientosFila.slice(2).map((boleto, indice) => (
                <Asiento
                  key={boleto?.id ?? `derecha-${indiceFila}-${indice}`}
                  boleto={boleto}
                  seleccionado={asientoSeleccionado}
                  onSeleccionar={handleSeleccionarAsiento}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-3 text-xs text-zinc-600 dark:text-zinc-400">
          <Leyenda color="bg-green-500" label="Disponible" />
          <Leyenda color="bg-blue-500" label="Seleccionado" />
          <Leyenda color="bg-yellow-400" label="Reservado" />
          <Leyenda color="bg-red-500" label="Comprado" />
        </div>

        {asientoSeleccionado ? (
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Asiento seleccionado:{' '}
            <span className="font-semibold">
              {asientoSeleccionado.numero_asiento}
            </span>
          </p>
        ) : null}

        {tokenReserva ? (
          <p className="text-sm text-green-700 dark:text-green-400">
            Reserva activa. Token:{' '}
            <span className="font-mono font-semibold">{tokenReserva}</span>
          </p>
        ) : null}

        <Button
          fullWidth
          variant="primary"
          isDisabled={!asientoSeleccionado || isPending}
          onPress={handleConfirmar}
        >
          {isPending ? 'Reservando...' : 'Confirmar Selección'}
        </Button>

        {tokenReserva && numeroAsientoReservado !== null ? (
          <FormularioConfirmar
            numeroAsiento={numeroAsientoReservado}
            tokenReserva={tokenReserva}
            onCompraExitosa={limpiarReserva}
          />
        ) : null}
      </div>
    </div>
  );
}

interface AsientoProps {
  boleto: Boleto | null;
  seleccionado: Boleto | null;
  onSeleccionar: (boleto: Boleto) => void;
}

function Asiento({ boleto, seleccionado, onSeleccionar }: AsientoProps) {
  if (!boleto) {
    return <div className="h-10 rounded-md bg-transparent" aria-hidden />;
  }

  const deshabilitado = asientoDeshabilitado(boleto);

  return (
    <button
      type="button"
      aria-label={`Asiento ${boleto.numero_asiento}, ${boleto.estado.toLowerCase()}`}
      disabled={deshabilitado}
      onClick={() => onSeleccionar(boleto)}
      className={`flex h-10 items-center justify-center rounded-md text-sm font-semibold transition-colors ${clasesAsiento(boleto, seleccionado)}`}
    >
      {boleto.numero_asiento}
    </button>
  );
}

function Leyenda({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 rounded-sm ${color}`} />
      {label}
    </span>
  );
}
