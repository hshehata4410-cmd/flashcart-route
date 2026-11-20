import Link from "next/link";
import TruckIcon from "@/src/svg/TruckIcon";
import GiftIcon from "@/src/svg/GiftIcon";
import TelephoneIcon from "@/src/svg/TelephoneIcon";
import MailIcon from "@/src/svg/MailIcon";
import UserIcon from "@/src/svg/UserIcon";
import UserPlusIcon from "@/src/svg/UserPlusIcon";

const Upper = () => {
  return (
    <div className="hidden lg:block text-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
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
              <Link
                href="/signin"
                className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <UserIcon className="size-3" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <UserPlusIcon className="size-3" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upper;
