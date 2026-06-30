export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-[400px] bg-gray-200 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="h-10 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
