import { Suspense } from "react";
import CatalogSkeleton from "@components/CatalogSkeleton";
import HeroSection from "@components/HeroSection";
import Container from "@components/ui/Container";
import FeaturedBrands from "@features/brands/components/FeaturedBrands";
import FeaturedCategories from "@features/categories/components/FeaturedCategories";
import FeaturedProducts from "@features/products/components/FeaturedProducts";
import ProductsSkeleton from "@features/products/components/ProductsSkeleton";

export default function Home() {
  return (
    <>
      <HeroSection
        title="Welcome to FlashCart"
        description="Everything you need, delivered to your door"
      />

      <Container className="flex flex-col gap-12 py-10">
        <Suspense fallback={<CatalogSkeleton />}>
          <FeaturedCategories />
        </Suspense>

        <Suspense fallback={<CatalogSkeleton />}>
          <FeaturedBrands />
        </Suspense>

        <Suspense fallback={<ProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </Container>
    </>
  );
}
