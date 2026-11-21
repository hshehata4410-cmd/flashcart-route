import type { ReactNode } from "react";
import type { Product } from "../types";
import ProductCard from "./ProductCard";

const ProductsList = ({
  products,
  trailing,
}: {
  products: Product[];
  /** Optional extra tile rendered after the last product (e.g. a view-all card). */
  trailing?: ReactNode;
}) => {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
        <p className="text-sm font-medium text-gray-600">No products found</p>
        <p className="mt-1 text-sm text-gray-400">
          Try a different search or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
        />
      ))}
      {trailing}
    </div>
  );
};

export default ProductsList;
