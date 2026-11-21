import HeroSection from "@components/HeroSection";
import Container from "@components/ui/Container";
import CartItems from "@features/cart/components/CartItems";

export default function CartPage() {
  return (
    <>
      <HeroSection
        title="Cart"
        description="Review the items in your cart before checkout."
      />
      <Container className="py-10">
        <CartItems />
      </Container>
    </>
  );
}
