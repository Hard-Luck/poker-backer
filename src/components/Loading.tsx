export default function Loading() {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative">
        <div className="h-12 w-12 animate-pulse rounded-full border-4 border-white"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center text-xl font-bold text-white">
          PB
        </div>
      </div>
    </div>
  );
}
