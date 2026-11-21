const ProfileSkeleton = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
      <div className="h-56 animate-pulse rounded-2xl border border-gray-100 bg-white" />

      <div>
        <div className="h-6 w-32 animate-pulse rounded bg-gray-100" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl border border-gray-100 bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
