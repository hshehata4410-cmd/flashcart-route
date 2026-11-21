import Link from "next/link";

type ViewAllCardProps = {
  href: string;
  title?: string;
  subtitle?: string;
};

/**
 * Placeholder tile rendered as the last card of a product list.
 * Navigates to the full collection (e.g. the shop screen).
 */
const ViewAllCard = ({
  href,
  title = "View all products",
  subtitle,
}: ViewAllCardProps) => {
  return (
    <Link
      href={href}
      aria-label={title}
      className="group flex flex-col overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-gray-50 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex aspect-square items-center justify-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white shadow-sm shadow-primary-600/20 transition-transform duration-300 group-hover:scale-105">
          <span aria-hidden="true">→</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center p-4 text-center">
        <span className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-primary-600">
          {title}
        </span>
        {subtitle && (
          <span className="mt-1 text-xs text-gray-500">{subtitle}</span>
        )}
      </div>
    </Link>
  );
};

export default ViewAllCard;
