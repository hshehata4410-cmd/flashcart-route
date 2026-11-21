"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Address, ProfileUser } from "../types";
import type { Order } from "@features/orders/types";
import OrdersList from "@features/orders/components/OrdersList";
import AddressesManager from "./AddressesManager";
import ProfileCard from "./ProfileCard";
import ProfileEditor from "./ProfileEditor";

type TabId = "account" | "addresses" | "orders";

const TABS: { id: TabId; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "addresses", label: "Addresses" },
  { id: "orders", label: "Orders" },
];

const isTabId = (value: string | null): value is TabId =>
  value === "account" || value === "addresses" || value === "orders";

/** Profile tabs: account summary, saved-addresses manager, and orders. */
const ProfileTabs = ({
  user,
  initialAddresses,
  initialOrders,
  ordersError,
}: {
  user: ProfileUser;
  initialAddresses: Address[];
  initialOrders: Order[];
  ordersError: string | null;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  // The `tab` param owns the active tab: links like `/profile?tab=orders`
  // and back/forward navigation stay in sync without extra state.
  const requestedTab = searchParams.get("tab");
  const activeTab: TabId = isTabId(requestedTab) ? requestedTab : "account";
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [profileUser, setProfileUser] = useState<ProfileUser>(user);

  const selectTab = (tab: TabId) => {
    router.replace(`${pathname}?tab=${tab}`, { scroll: false });
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Profile sections"
        className="mb-6 inline-flex rounded-full border border-gray-200 bg-gray-50 p-1"
      >
        {TABS.map((tab) => {
          const selected = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`profile-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`profile-panel-${tab.id}`}
              onClick={() => selectTab(tab.id)}
              className={[
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                selected
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              ].join(" ")}
            >
              {tab.label}
              {tab.id === "addresses" && (
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-xs",
                    selected
                      ? "bg-primary-50 text-primary-600"
                      : "bg-gray-200/70 text-gray-500",
                  ].join(" ")}
                >
                  {addresses.length}
                </span>
              )}
              {tab.id === "orders" && (
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-xs",
                    selected
                      ? "bg-primary-50 text-primary-600"
                      : "bg-gray-200/70 text-gray-500",
                  ].join(" ")}
                >
                  {initialOrders.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`profile-panel-${activeTab}`}
        aria-labelledby={`profile-tab-${activeTab}`}
      >
        {activeTab === "account" ? (
          <div className="grid max-w-xl gap-4">
            <ProfileCard user={profileUser} />
            <ProfileEditor user={profileUser} onProfileChange={setProfileUser} />
          </div>
        ) : activeTab === "addresses" ? (
          <AddressesManager
            addresses={addresses}
            onAddressesChange={setAddresses}
          />
        ) : (
          <OrdersList orders={initialOrders} loadError={ordersError} />
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
