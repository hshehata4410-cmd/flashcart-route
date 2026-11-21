const Loading = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading next page"
      className="fixed inset-0 z-100 flex items-center justify-center bg-gray-900/30 backdrop-blur-md"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/95 px-10 py-7 shadow-xl">
        <span
          aria-hidden="true"
          className="size-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-primary-600"
        />
        <span className="text-sm font-semibold text-gray-700">Loading…</span>
      </div>
    </div>
  );
};

export default Loading;
