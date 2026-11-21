import { Suspense } from "react";
import HeroSection from "@components/HeroSection";
import Container from "@components/ui/Container";
import ProductsBreadcrumb from "@features/products/components/ProductsBreadcrumb";
import ProductsFilters from "@features/products/components/ProductsFilters";
import ProductsSection from "@features/products/components/ProductsSection";
import ProductsSkeleton from "@features/products/components/ProductsSkeleton";
import type { ProductsSearchParams } from "@features/products/types";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}) {
  return (
    <>
      <HeroSection
        title="Shop"
        description="Browse all FlashCart products and find what you need."
      />

      <Container className="py-10">
        <div className="mb-6">
          <Suspense
            fallback={
              <div className="h-5 w-48 animate-pulse rounded bg-gray-100" />
            }
          >
            <ProductsBreadcrumb searchParams={searchParams} />
          </Suspense>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="w-full lg:sticky lg:top-24 lg:w-64 lg:shrink-0">
            <Suspense
              fallback={
                <div className="h-[26rem] animate-pulse rounded-2xl border border-gray-100 bg-white" />
              }
            >
              <ProductsFilters />
            </Suspense>
          </aside>

          <div className="min-w-0 flex-1">
            <Suspense fallback={<ProductsSkeleton />}>
              <ProductsSection searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </Container>
    </>
  );
}
