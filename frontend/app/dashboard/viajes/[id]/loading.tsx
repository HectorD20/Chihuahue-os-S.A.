export default function ViajeLoading() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
      <div className="h-9 w-80 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-96 w-full max-w-md animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900" />
    </div>
  );
}
