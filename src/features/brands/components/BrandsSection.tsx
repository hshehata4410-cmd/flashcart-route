import CatalogSection from "@components/CatalogSection";
import type { CatalogSearchParams } from "@features/catalog/types";

const BrandsSection = ({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) => {
  return <CatalogSection kind="brands" searchParams={searchParams} />;
};

export default BrandsSection;
