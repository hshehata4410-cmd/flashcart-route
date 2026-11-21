import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@api/products";
import ProductDetailsInfo from "./ProductDetailsInfo";
import ProductGallery from "./ProductGallery";
import ReviewsSection from "@features/reviews/components/ReviewsSection";

const ProductDetails = async ({ productId }: { productId: string }) => {
  let product;

  try {
    product = await getProduct(productId);
  } catch {
    notFound();
  }

  if (!product) notFound();

  const galleryImages = [product.imageCover, ...(product.images ?? [])].filter(
    (image, index, all) => Boolean(image) && all.indexOf(image) === index,
  );

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <ProductGallery images={galleryImages} title={product.title} />
        <ProductDetailsInfo product={product} />
      </div>
      <ReviewsSection productId={productId} />
    </div>
  );
};

export const ProductDetailsBreadcrumb = () => (
  <nav aria-label="Breadcrumb" className="mb-6 text-sm">
    <Link
      href="/products"
      className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
    >
      ← Back to products
    </Link>
  </nav>
);

export default ProductDetails;
