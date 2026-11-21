"use client";

import Link from "next/link";
import Container from "@components/ui/Container";
import { useAuth } from "@features/auth/utils/useAuth";
import TruckIcon from "@svg/TruckIcon";
import GiftIcon from "@svg/GiftIcon";
import TelephoneIcon from "@svg/TelephoneIcon";
import MailIcon from "@svg/MailIcon";
import UserIcon from "@svg/UserIcon";
import UserPlusIcon from "@svg/UserPlusIcon";
import LogoutIcon from "@svg/LogoutIcon";

const Upper = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="hidden lg:block text-sm border-b border-gray-100">
      <Container>
        <div className="flex justify-between items-center h-10">
          <div className="flex items-center gap-6 text-gray-500">
            <span className="flex items-center gap-2">
              <TruckIcon className="size-3 text-primary-600" />
              <span>Free Shipping on Orders 500 EGP</span>
            </span>
            <span className="flex items-center gap-2">
              <GiftIcon className="size-3 text-primary-600" />
              <span>New Arrivals Daily</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-gray-500">
              <a
                href="tel:+18001234567"
                className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
              >
                <TelephoneIcon className="size-3" />
                <span>+1 (800) 123-4567</span>
              </a>
              <a
                href="mailto:support@freshcart.com"
                className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
              >
                <MailIcon className="size-3" />
                <span>support@freshcart.com</span>
              </a>
            </div>
            <span className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <LogoutIcon className="size-3" />
                    <span>Logout</span>
                  </button>
                  <Link
                    href="/profile"
                    className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <UserIcon className="size-3" />
                    <span>Profile</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <UserIcon className="size-3" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <UserPlusIcon className="size-3" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Upper;
