import ApperIcon from "@/components/ApperIcon";

export default function Loading({ type = "default", message = "Loading..." }) {
  if (type === "table") {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-200 h-16 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-3 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
              </div>
              <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin">
        <ApperIcon name="Loader2" size={32} className="text-primary-600" />
      </div>
      <p className="mt-4 text-sm text-slate-600">{message}</p>
    </div>
  );
}