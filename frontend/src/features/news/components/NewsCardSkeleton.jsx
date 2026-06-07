export default function NewsCardSkeleton() {
  return (
    <div className="flex flex-col bg-bg border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-fg/5"></div>
      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-16 bg-fg/10 rounded"></div>
          <div className="h-4 w-20 bg-fg/5 rounded-full"></div>
        </div>
        <div className="h-6 w-full bg-fg/10 rounded mb-2"></div>
        <div className="h-6 w-3/4 bg-fg/10 rounded mb-4"></div>
        <div className="h-3 w-full bg-fg/5 rounded mb-2"></div>
        <div className="h-3 w-full bg-fg/5 rounded mb-2"></div>
        <div className="h-3 w-2/3 bg-fg/5 rounded mb-4 flex-grow"></div>
        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <div className="h-3 w-24 bg-fg/5 rounded"></div>
          <div className="flex gap-3">
            <div className="h-4 w-4 bg-fg/10 rounded"></div>
            <div className="h-4 w-4 bg-fg/10 rounded"></div>
            <div className="h-4 w-4 bg-fg/10 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}