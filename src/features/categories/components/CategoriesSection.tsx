import CatalogSection from "@components/CatalogSection";
import type { CatalogSearchParams } from "@features/catalog/types";

const CategoriesSection = ({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) => {
  return <CatalogSection kind="categories" searchParams={searchParams} />;
};

export default CategoriesSection;
