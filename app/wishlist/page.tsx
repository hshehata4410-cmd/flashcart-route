import HeroSection from "@components/HeroSection";
import Container from "@components/ui/Container";
import WishlistItems from "@features/wishlist/components/WishlistItems";

export default function WishlistPage() {
  return (
    <>
      <HeroSection
        title="Wishlist"
        description="Products you saved for later."
      />
      <Container className="py-10">
        <WishlistItems />
      </Container>
    </>
  );
}
