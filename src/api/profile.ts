import type {
  ProfileUpdateInput,
  ProfileUser,
} from "@features/profile/types";
import { axios } from "./axios";

const withToken = (token: string) => ({ headers: { token } });

/** Updates the signed-in user's data (`PUT /users/updateMe`). */
export const updateProfile = async (
  token: string,
  input: ProfileUpdateInput,
): Promise<ProfileUser> => {
  const { data } = await axios.put("/users/updateMe", input, withToken(token));

  const user = (
    data as { user?: unknown; data?: unknown } | null
  )?.user ??
    (data as { data?: unknown } | null)?.data ??
    data;

  const record =
    user && typeof user === "object"
      ? (user as Record<string, unknown>)
      : ({} as Record<string, unknown>);

  return {
    name: typeof record.name === "string" ? record.name : input.name,
    email: typeof record.email === "string" ? record.email : input.email,
    phone: typeof record.phone === "string" ? record.phone : input.phone,
    role: typeof record.role === "string" ? record.role : undefined,
  };
};
