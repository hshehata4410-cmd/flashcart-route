import Link from "next/link";
import { getProducts } from "@api/products";
import ProductsList from "./ProductsList";
import ViewAllCard from "./ViewAllCard";

const FEATURED_COUNT = 10;

const FeaturedProducts = async () => {
  let products;
  let total: number | undefined;

  try {
    const response = await getProducts({ limit: FEATURED_COUNT });
    products = response.data;
    total = response.results;
  } catch {
    return null;
  }

  if (products.length === 0) return null;

  return (
    <section aria-labelledby="featured-products-heading">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2
          id="featured-products-heading"
          className="text-xl font-bold text-gray-900"
        >
          Featured Products
        </h2>
        <Link
          href="/products"
          className="shrink-0 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
        >
          View all →
        </Link>
      </div>

      <ProductsList
        products={products}
        trailing={
          <ViewAllCard
            href="/products"
            subtitle={
              typeof total === "number" ? `Browse all ${total} products` : undefined
            }
          />
        }
      />
    </section>
  );
};

export default FeaturedProducts;
