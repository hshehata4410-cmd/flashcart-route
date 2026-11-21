import type {
  Address,
  AddressInput,
  AddressesResponse,
} from "@features/profile/types";
import { axios } from "./axios";

const withToken = (token: string) => ({ headers: { token } });

/** Lists the signed-in user's addresses (`GET /addresses`). */
export const getAddresses = async (token: string): Promise<Address[]> => {
  const { data } = await axios.get<AddressesResponse>(
    "/addresses",
    withToken(token),
  );

  return data.data;
};

/** Adds an address for the signed-in user (`POST /addresses`). */
export const addAddress = async (
  token: string,
  input: AddressInput,
): Promise<void> => {
  await axios.post("/addresses", input, withToken(token));
};

/** Updates one of the signed-in user's addresses (`PUT /addresses/:id`). */
export const updateAddress = async (
  token: string,
  addressId: string,
  input: AddressInput,
): Promise<void> => {
  await axios.put(`/addresses/${addressId}`, input, withToken(token));
};

/** Removes one of the signed-in user's addresses (`DELETE /addresses/:id`). */
export const removeAddress = async (
  token: string,
  addressId: string,
): Promise<void> => {
  await axios.delete(`/addresses/${addressId}`, withToken(token));
};
