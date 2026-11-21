import Link from "next/link";
import { getBrands, getCategories } from "@api/catalog";
import type { ProductsSearchParams } from "../types";

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

type Crumb = {
  label: string;
  href?: string;
};

/**
 * Breadcrumb for the shop screen, rendered just under the hero.
 *
 * Reflects where the shopper came from: `/categories/<name>` when the list
 * is filtered to a single category, `/brands/<name>` for a single brand,
 * and a plain Home / Products trail otherwise.
 */
const ProductsBreadcrumb = async ({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}) => {
  const params = await searchParams;

  const rawCategory = params.category;
  const categoryIds =
    rawCategory === undefined
      ? []
      : Array.isArray(rawCategory)
        ? rawCategory
        : [rawCategory];
  const brandId = firstValue(params.brand);

  const trail: Crumb[] = [{ label: "Home", href: "/" }];

  if (categoryIds.length === 1 && !brandId) {
    let name: string | undefined;

    try {
      const categories = await getCategories();
      name = categories.find((category) => category._id === categoryIds[0])?.name;
    } catch {
      name = undefined;
    }

    trail.push({ label: "Categories", href: "/categories" });
    trail.push({ label: name ?? "Category" });
  } else if (brandId && categoryIds.length === 0) {
    let name: string | undefined;

    try {
      const brands = await getBrands();
      name = brands.find((brand) => brand._id === brandId)?.name;
    } catch {
      name = undefined;
    }

    trail.push({ label: "Brands", href: "/brands" });
    trail.push({ label: name ?? "Brand" });
  } else {
    trail.push({ label: "Products" });
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden="true" className="text-gray-300">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-semibold text-gray-900" : "text-gray-500"}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 transition-colors hover:text-primary-600"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProductsBreadcrumb;
