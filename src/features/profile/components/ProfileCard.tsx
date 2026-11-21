import MailIcon from "@svg/MailIcon";
import TelephoneIcon from "@svg/TelephoneIcon";
import type { ProfileUser } from "../types";

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  user: "Customer",
};

/** Account summary: avatar, name, role, and email. */
const ProfileCard = ({ user }: { user: ProfileUser }) => {
  const roleLabel = (user.role && ROLE_LABELS[user.role]) ?? user.role;

  return (
    <section
      aria-labelledby="profile-heading"
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-50 text-lg font-bold text-primary-600"
        >
          {initials(user.name) || "?"}
        </span>

        <div className="min-w-0">
          <h2
            id="profile-heading"
            className="truncate text-base font-semibold text-gray-900"
          >
            {user.name}
          </h2>
          {roleLabel && (
            <span className="mt-1 inline-flex rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-600">
              {roleLabel}
            </span>
          )}
        </div>
      </div>

      <dl className="mt-6 border-t border-gray-100 pt-5">
        <div className="flex items-start gap-3">
          <MailIcon className="mt-0.5 size-4 shrink-0 text-gray-400" />
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Email
            </dt>
            <dd className="mt-0.5 truncate text-sm text-gray-700">
              {user.email ?? "Not available"}
            </dd>
          </div>
        </div>
        {user.phone && (
          <div className="mt-4 flex items-start gap-3">
            <TelephoneIcon className="mt-0.5 size-4 shrink-0 text-gray-400" />
            <div className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Phone
              </dt>
              <dd className="mt-0.5 truncate text-sm text-gray-700">
                {user.phone}
              </dd>
            </div>
          </div>
        )}
      </dl>
    </section>
  );
};

export default ProfileCard;
