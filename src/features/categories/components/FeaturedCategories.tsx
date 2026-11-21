import Link from "next/link";
import { getCategories } from "@api/catalog";
import CatalogGrid from "@components/CatalogGrid";

const FEATURED_COUNT = 4;

const FeaturedCategories = async () => {
  let categories;

  try {
    categories = await getCategories();
  } catch {
    return null;
  }

  const items = categories.slice(0, FEATURED_COUNT).map((category) => ({
    id: category._id,
    name: category.name,
    image: category.image,
    href: `/products?category=${category._id}`,
  }));

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="featured-categories-heading">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2
          id="featured-categories-heading"
          className="text-xl font-bold text-gray-900"
        >
          Featured Categories
        </h2>
        <Link
          href="/categories"
          className="shrink-0 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
        >
          View all →
        </Link>
      </div>

      <CatalogGrid items={items} kind="categories" />
    </section>
  );
};

export default FeaturedCategories;
