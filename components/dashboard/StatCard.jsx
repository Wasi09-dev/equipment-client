export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm shadow-orange-900/5 transition hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/10 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-orange-50 text-orange-500">
          {Icon && <Icon className="h-5 w-5" />}
        </span>
        {hint && (
          <span className="text-right text-xs font-medium text-stone-400">
            {hint}
          </span>
        )}
      </div>
      <p className="mt-3 truncate text-2xl font-extrabold text-[#3b2314]">
        {value}
      </p>
      <p className="mt-0.5 text-sm text-stone-500">{label}</p>
    </div>
  );
}
