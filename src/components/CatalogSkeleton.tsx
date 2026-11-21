const CatalogSkeleton = () => {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
        <div className="h-10 w-full animate-pulse rounded-full bg-gray-100 sm:w-80" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="aspect-[4/3] animate-pulse bg-gray-100" />
            <div className="px-4 py-3.5">
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogSkeleton;
