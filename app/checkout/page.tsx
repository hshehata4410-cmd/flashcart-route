import Link from "next/link";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import HeroSection from "@components/HeroSection";
import Container from "@components/ui/Container";
import { getAddresses } from "@api/addresses";
import {
  AUTH_COOKIE_NAME,
  AUTH_USER_COOKIE_NAME,
} from "@features/auth/utils/session";
import { readProfileUser } from "@features/profile/utils/session";
import type { Address } from "@features/profile/types";
import CheckoutSection from "@features/orders/components/CheckoutSection";

export const metadata: Metadata = {
  title: "Checkout | FlashCart",
  description: "Choose a shipping address and payment method to place your order.",
};

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const user = readProfileUser(
    cookieStore.get(AUTH_USER_COOKIE_NAME)?.value,
    token,
  );

  if (!token || !user) {
    return (
      <>
        <HeroSection
          title="Checkout"
          description="Choose a shipping address and payment method."
        />
        <Container className="py-10">
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
            <p className="text-sm font-semibold text-gray-700">
              You need to sign in to check out.
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Your cart is saved — sign in to place your order.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700"
            >
              Sign in
            </Link>
          </div>
        </Container>
      </>
    );
  }

  let addresses: Address[] = [];
  try {
    addresses = await getAddresses(token);
  } catch {
    addresses = [];
  }

  return (
    <>
      <HeroSection
        title="Checkout"
        description="Choose a shipping address and payment method to place your order."
      />
      <Container className="py-10">
        <CheckoutSection initialAddresses={addresses} />
      </Container>
    </>
  );
}
