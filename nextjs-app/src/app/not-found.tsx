import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <p className="text-xs font-medium text-amber-600 uppercase tracking-[0.2em] mb-2">404</p>
      <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-3">Page not found</h1>
      <p className="text-stone-400 text-sm mb-6 max-w-xs text-center">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="px-5 py-2.5 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-all">
        Go home
      </Link>
    </div>
  );
}
