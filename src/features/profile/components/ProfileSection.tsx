import Link from "next/link";
import { cookies } from "next/headers";
import { getAddresses } from "@api/addresses";
import { getUserOrders } from "@api/orders";
import { getApiErrorMessage } from "@api/axios";
import {
  AUTH_COOKIE_NAME,
  AUTH_USER_COOKIE_NAME,
} from "@features/auth/utils/session";
import { decodeAuthToken } from "@features/auth/utils/token";
import type { Address } from "../types";
import type { Order } from "@features/orders/types";
import { readProfileUser } from "../utils/session";
import ProfileTabs from "./ProfileTabs";

type NoticeProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

const Notice = ({
  title,
  description,
  actionLabel,
  actionHref,
}: NoticeProps) => (
  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
    <p className="text-sm font-semibold text-gray-700">{title}</p>
    <p className="mt-1 text-sm text-gray-400">{description}</p>
    <Link
      href={actionHref}
      className="mt-6 inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700"
    >
      {actionLabel}
    </Link>
  </div>
);

/**
 * Request-time profile data: the user snapshot cookie plus the addresses from
 * the API. Lives behind Suspense so the rest of the page can be prerendered.
 */
const ProfileSection = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const user = readProfileUser(
    cookieStore.get(AUTH_USER_COOKIE_NAME)?.value,
    token,
  );

  if (!token || !user) {
    return (
      <Notice
        title="You need to sign in to view your profile."
        description="Your details and saved addresses are only visible to you."
        actionLabel="Sign in"
        actionHref="/login"
      />
    );
  }

  let addresses: Address[] = [];
  let addressesError: string | null = null;

  try {
    addresses = await getAddresses(token);
  } catch (error) {
    addressesError = getApiErrorMessage(
      error,
      "Unable to load your addresses right now.",
    );
  }

  let orders: Order[] = [];
  let ordersError: string | null = null;
  const userId = decodeAuthToken(token)?.id;

  if (userId) {
    try {
      orders = await getUserOrders(token, userId);
    } catch (error) {
      ordersError = getApiErrorMessage(
        error,
        "Unable to load your orders right now.",
      );
    }
  }

  return (
    <>
      {addressesError && (
        <div className="mb-5">
          <Notice
            title={addressesError}
            description="Refresh the page, or sign in again if your session has expired."
            actionLabel="Back to sign in"
            actionHref="/login"
          />
        </div>
      )}
      <ProfileTabs
        user={user}
        initialAddresses={addresses}
        initialOrders={orders}
        ordersError={ordersError}
      />
    </>
  );
};

export default ProfileSection;
