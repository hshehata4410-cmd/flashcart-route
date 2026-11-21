"use client";

import { useEffect } from "react";
import { useProductsStore } from "../../../store/useProductsStore";

/**
 * Loads the persisted cart/wishlist after hydration so the server and first
 * client render agree on empty state.
 */
const ProductsStoreHydrator = () => {
  useEffect(() => {
    void useProductsStore.persist.rehydrate();
  }, []);

  return null;
};

export default ProductsStoreHydrator;
