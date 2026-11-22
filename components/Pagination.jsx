import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

function pageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("start-ellipsis");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < total - 1) pages.push("end-ellipsis");
  pages.push(total);

  return pages;
}

const itemClass =
  "inline-flex size-9 items-center justify-center rounded-xl border text-sm font-semibold transition sm:size-10";

export default function Pagination({ currentPage, totalPages, params = {} }) {
  if (!totalPages || totalPages <= 1) return null;

  const hrefFor = (page) => {
    const qs = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (key === "page") return;
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== "") {
            qs.append(key, item);
          }
        });
      } else if (value !== undefined && value !== null && value !== "") {
        qs.set(key, value);
      }
    });

    if (page > 1) qs.set("page", String(page));

    const query = qs.toString();
    return query ? `/equipment?${query}` : "/equipment";
  };

  return (
    <nav
      aria-label="Equipment pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
    >
      {currentPage > 1 ? (
        <Link
          href={hrefFor(currentPage - 1)}
          className={`${itemClass} gap-1 border-orange-200 bg-white px-3 text-stone-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span
          className={`${itemClass} gap-1 cursor-not-allowed border-stone-200 bg-stone-50 px-3 text-stone-300`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {pageNumbers(currentPage, totalPages).map((page) => {
        if (typeof page === "string") {
          return (
            <span
              key={page}
              className="inline-flex size-9 items-center justify-center text-sm text-stone-400 sm:size-10"
            >
              …
            </span>
          );
        }

        const isCurrent = page === currentPage;
        return (
          <Link
            key={page}
            href={hrefFor(page)}
            aria-current={isCurrent ? "page" : undefined}
            className={`${itemClass} ${
              isCurrent
                ? "border-transparent bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30"
                : "border-orange-200 bg-white text-stone-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages ? (
        <Link
          href={hrefFor(currentPage + 1)}
          className={`${itemClass} gap-1 border-orange-200 bg-white px-3 text-stone-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className={`${itemClass} gap-1 cursor-not-allowed border-stone-200 bg-stone-50 px-3 text-stone-300`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
