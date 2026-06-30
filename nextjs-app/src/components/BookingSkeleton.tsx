export default function BookingSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-[220px] h-[180px] sm:h-[200px] bg-gray-100" />
            <div className="flex-1 p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-gray-100 rounded" />
                  <div className="h-3 w-32 bg-gray-100 rounded" />
                </div>
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-2.5 w-16 bg-gray-100 rounded" />
                    <div className="h-3.5 w-20 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="flex gap-2">
                  <div className="h-8 w-24 bg-gray-100 rounded-full" />
                  <div className="h-8 w-24 bg-gray-100 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
