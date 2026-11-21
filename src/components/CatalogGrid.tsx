import type { CatalogKind } from "@features/catalog/types";
import CatalogCard from "./CatalogCard";

type CatalogGridProps = {
  items: { id: string; name: string; image?: string; href: string }[];
  kind: CatalogKind;
};

const CatalogGrid = ({ items, kind }: CatalogGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item, index) => (
        <CatalogCard
          key={item.id}
          name={item.name}
          image={item.image}
          href={item.href}
          kind={kind}
          priority={index < 4}
        />
      ))}
    </div>
  );
};

export default CatalogGrid;
