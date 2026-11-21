import { Suspense } from "react";
import Container from "@components/ui/Container";
import ProductDetails, {
  ProductDetailsBreadcrumb,
} from "@features/products/components/ProductDetails";

/**
 * Plural alias for the product details page. Existing cards and cart items
 * link to `/products/:id`; the canonical requested route is
 * `/product/:productId`. Both render the same view.
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  return (
    <Container className="py-8">
      <ProductDetailsBreadcrumb />
      <Suspense
        fallback={
          <div className="grid animate-pulse gap-10 lg:grid-cols-2">
            <div className="aspect-square rounded-2xl bg-gray-100" />
            <div className="space-y-3 pt-2">
              <div className="h-6 w-2/3 rounded bg-gray-100" />
              <div className="h-4 w-1/3 rounded bg-gray-100" />
              <div className="h-8 w-1/2 rounded bg-gray-100" />
              <div className="h-24 w-full rounded bg-gray-100" />
            </div>
          </div>
        }
      >
        <ProductDetails productId={productId} />
      </Suspense>
    </Container>
  );
}
