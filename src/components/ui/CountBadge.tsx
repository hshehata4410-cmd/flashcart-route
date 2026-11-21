type CountBadgeProps = {
  count: number;
  className?: string;
};

/** Small red counter, e.g. cart / wishlist totals. Hidden when empty. */
const CountBadge = ({ count, className }: CountBadgeProps) => {
  if (count <= 0) return null;

  return (
    <span
      className={[
        "flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

export default CountBadge;
