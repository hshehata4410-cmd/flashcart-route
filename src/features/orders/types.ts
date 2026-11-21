/** Shipping address payload for placing an order. */
export type ShippingAddressInput = {
  details: string;
  phone: string;
  city: string;
};

/** Product snapshot inside an order item (may be a bare id). */
export type OrderProduct = {
  _id?: string;
  id?: string;
  title?: string;
  imageCover?: string;
  price?: number;
};

/** One line in an order (`cartItems`). */
export type OrderItem = {
  _id?: string;
  product?: OrderProduct | string | null;
  count?: number;
  quantity?: number;
  price?: number;
};

/** A placed order (`GET /orders/user/:userId`). */
export type Order = {
  _id: string;
  id?: string;
  cartItems?: OrderItem[];
  totalOrderPrice?: number;
  totalPrice?: number;
  paymentMethodType?: string;
  isPaid?: boolean;
  isDelivered?: boolean;
  shippingAddress?: (ShippingAddressInput & { name?: string }) | null;
  createdAt?: string;
};

/** `GET /orders/user/:userId` response. */
export type UserOrdersResponse = {
  data: Order[];
};
