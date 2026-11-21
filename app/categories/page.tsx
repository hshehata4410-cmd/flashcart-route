import { Suspense } from "react";
import type { Metadata } from "next";
import HeroSection from "@components/HeroSection";
import Container from "@components/ui/Container";
import CatalogSkeleton from "@components/CatalogSkeleton";
import CategoriesSection from "@features/categories/components/CategoriesSection";
import type { CatalogSearchParams } from "@features/catalog/types";

export const metadata: Metadata = {
  title: "Categories | FlashCart",
  description: "Browse every FlashCart category and shop its products.",
};

export default function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  return (
    <>
      <HeroSection
        title="Categories"
        description="Explore every department and jump straight to its products."
      />

      <Container className="py-10">
        <Suspense fallback={<CatalogSkeleton />}>
          <CategoriesSection searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}
