import Link from "next/link";
import { getBrands } from "@api/catalog";
import CatalogGrid from "@components/CatalogGrid";

const FEATURED_COUNT = 4;

const FeaturedBrands = async () => {
  let brands;

  try {
    brands = await getBrands();
  } catch {
    return null;
  }

  const items = brands.slice(0, FEATURED_COUNT).map((brand) => ({
    id: brand._id,
    name: brand.name,
    image: brand.image,
    href: `/products?brand=${brand._id}`,
  }));

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="featured-brands-heading">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2
          id="featured-brands-heading"
          className="text-xl font-bold text-gray-900"
        >
          Featured Brands
        </h2>
        <Link
          href="/brands"
          className="shrink-0 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
        >
          View all →
        </Link>
      </div>

      <CatalogGrid items={items} kind="brands" />
    </section>
  );
};

export default FeaturedBrands;
