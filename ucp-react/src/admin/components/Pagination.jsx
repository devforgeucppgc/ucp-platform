export default function Pagination({ page, pages, onPrev, onNext }) {
  return (
    <div className="mt-4 flex items-center justify-between gap-2 text-sm">
      <button
        disabled={page <= 1}
        onClick={onPrev}
        className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-50 dark:border-slate-700"
      >
        Prev
      </button>
      <div className="text-slate-500 dark:text-slate-400">
        Page <span className="font-semibold">{page}</span> of{" "}
        <span className="font-semibold">{pages}</span>
      </div>
      <button
        disabled={page >= pages}
        onClick={onNext}
        className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-50 dark:border-slate-700"
      >
        Next
      </button>
    </div>
  );
}