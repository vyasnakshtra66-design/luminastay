export default function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-pulse">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100" />
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="h-5 w-48 bg-gray-100 rounded mx-auto sm:mx-0" />
          <div className="h-3.5 w-32 bg-gray-100 rounded mx-auto sm:mx-0" />
          <div className="h-3 w-24 bg-gray-100 rounded mx-auto sm:mx-0" />
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="h-5 w-36 bg-gray-100 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="space-y-1.5">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-9 w-full bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
