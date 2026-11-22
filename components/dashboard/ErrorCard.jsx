import { AlertTriangle } from "lucide-react";

export default function ErrorCard({ message }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/70 p-5 text-sm">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
      <div>
        <p className="font-semibold text-red-600">Something went wrong.</p>
        <p className="mt-1 text-red-500">
          {message ||
            `Make sure the API server is running on ${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            } and refresh the page.`}
        </p>
      </div>
    </div>
  );
}
