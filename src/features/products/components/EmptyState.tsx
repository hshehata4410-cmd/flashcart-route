import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

const EmptyState = ({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) => {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
      <p className="text-base font-semibold text-gray-700">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
