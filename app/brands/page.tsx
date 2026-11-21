import { Suspense } from "react";
import type { Metadata } from "next";
import HeroSection from "@components/HeroSection";
import Container from "@components/ui/Container";
import CatalogSkeleton from "@components/CatalogSkeleton";
import BrandsSection from "@features/brands/components/BrandsSection";
import type { CatalogSearchParams } from "@features/catalog/types";

export const metadata: Metadata = {
  title: "Brands | FlashCart",
  description: "Discover the brands available on FlashCart and shop their products.",
};

export default function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  return (
    <>
      <HeroSection
        title="Brands"
        description="Shop products from the brands you already know and love."
      />

      <Container className="py-10">
        <Suspense fallback={<CatalogSkeleton />}>
          <BrandsSection searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}
