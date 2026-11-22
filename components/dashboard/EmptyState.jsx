import Link from "next/link";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-orange-200 bg-white/70 px-6 py-16 text-center">
      {Icon && (
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
          <Icon className="h-7 w-7" />
        </span>
      )}
      <h2 className="mt-4 text-lg font-bold text-stone-900">{title}</h2>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-stone-500">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-colors hover:from-orange-600 hover:to-orange-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
