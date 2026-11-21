import { Suspense } from "react";
import type { Metadata } from "next";
import HeroSection from "@components/HeroSection";
import Container from "@components/ui/Container";
import ProfileSection from "@features/profile/components/ProfileSection";
import ProfileSkeleton from "@features/profile/components/ProfileSkeleton";

export const metadata: Metadata = {
  title: "My Profile | FlashCart",
  description: "Your FlashCart account details, saved addresses, and orders.",
};

export default function ProfilePage() {
  return (
    <>
      <HeroSection
        title="My Profile"
        description="Your account details, saved addresses, and orders."
      />

      <Container className="py-10">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileSection />
        </Suspense>
      </Container>
    </>
  );
}
