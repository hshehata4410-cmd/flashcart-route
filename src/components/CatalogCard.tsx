import Image from "next/image";
import Link from "next/link";
import type { CatalogKind } from "@features/catalog/types";

type CatalogCardProps = {
  name: string;
  image?: string;
  /** Where the card goes — the matching, filtered product list. */
  href: string;
  kind: CatalogKind;
  /** Above-the-fold tiles load eagerly so the hero-adjacent image isn't LCP-blocked. */
  priority?: boolean;
};

/**
 * Linked tile for one category or brand. Categories use a cover image; brands
 * are usually transparent logos, so they sit contained in a white tile.
 */
const CatalogCard = ({
  name,
  image,
  href,
  kind,
  priority = false,
}: CatalogCardProps) => {
  const isBrand = kind === "brands";

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div
        className={[
          "relative aspect-[4/3] overflow-hidden",
          isBrand ? "bg-white" : "bg-gray-50",
        ].join(" ")}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading={priority ? "eager" : "lazy"}
            className={[
              "transition-transform duration-300 group-hover:scale-105",
              isBrand ? "object-contain p-8" : "object-cover",
            ].join(" ")}
          />
        ) : (
          <span className="flex size-full items-center justify-center text-4xl font-bold text-gray-200">
            {name.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3.5">
        <h2 className="truncate text-sm font-semibold text-gray-800">
          {name}
        </h2>
        <span className="shrink-0 text-xs font-semibold text-primary-600 transition-transform duration-200 group-hover:translate-x-0.5">
          Shop →
        </span>
      </div>
    </Link>
  );
};

export default CatalogCard;
