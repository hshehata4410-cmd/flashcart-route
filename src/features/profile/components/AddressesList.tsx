import type { ReactNode } from "react";
import TelephoneIcon from "@svg/TelephoneIcon";
import type { Address } from "../types";

type AddressesListProps = {
  addresses: Address[];
  /** Extra control in the header, e.g. the "Add new address" button. */
  headerAction?: ReactNode;
  onEdit?: (address: Address) => void;
  onRemove?: (address: Address) => void;
};

/** Saved addresses, or an empty state when the account has none yet. */
const AddressesList = ({
  addresses,
  headerAction,
  onEdit,
  onRemove,
}: AddressesListProps) => {
  return (
    <section aria-labelledby="addresses-heading">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2
            id="addresses-heading"
            className="text-lg font-semibold text-gray-900"
          >
            Addresses
          </h2>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
            {addresses.length} saved
          </span>
        </div>
        {headerAction}
      </div>

      {addresses.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <p className="text-sm font-semibold text-gray-700">
            No saved addresses
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Add your first address to speed up checkout.
          </p>
        </div>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address._id}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  {address.name}
                </h3>
                <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-600">
                  {address.city}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {address.details}
              </p>

              <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <TelephoneIcon className="size-3.5 shrink-0 text-gray-400" />
                <span dir="ltr">{address.phone}</span>
              </p>

              {(onEdit || onRemove) && (
                <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(address)}
                      className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-primary-600 hover:text-primary-600"
                    >
                      Edit
                    </button>
                  )}
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(address)}
                      className="rounded-full px-4 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AddressesList;
