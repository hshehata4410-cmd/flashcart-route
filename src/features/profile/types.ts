/** The signed-in user as shown on the profile screen. */
export type ProfileUser = {
  name: string;
  /** Missing for sessions started before the user snapshot cookie existed. */
  email?: string;
  role?: string;
  phone?: string;
};

/** Payload for updating the signed-in user's data (`PUT /users/updateMe`). */
export type ProfileUpdateInput = {
  name: string;
  email: string;
  phone: string;
};

/** A saved shipping address (`GET /addresses`). */
export type Address = {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
};

/** Payload for adding or updating an address (`POST` / `PUT /addresses`). */
export type AddressInput = {
  name: string;
  details: string;
  phone: string;
  city: string;
};

/** `GET /addresses` response. */
export type AddressesResponse = {
  results: number;
  status: string;
  data: Address[];
};
