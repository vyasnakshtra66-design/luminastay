export default function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-gray-100" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 bg-gray-100 rounded" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="w-3 h-3 bg-gray-100 rounded" />
              ))}
            </div>
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-gray-100 rounded-full" />
              <div className="h-5 w-16 bg-gray-100 rounded-full" />
              <div className="h-5 w-16 bg-gray-100 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="h-6 w-20 bg-gray-100 rounded" />
              <div className="h-8 w-24 bg-gray-100 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
