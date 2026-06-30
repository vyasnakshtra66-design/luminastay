interface Props {
  count?: number;
}

export default function DestinationSkeleton({ count = 6 }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
            <div className="h-9 bg-gray-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
