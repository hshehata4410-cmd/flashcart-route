---
name: flash-cart-overview
description: Product overview for FlashCart, an e-commerce app with auth (login/logout/registration), products, categories with filtering, brands, and user management (password reset, forgot password, addresses). Use when planning or implementing any feature, writing UI copy, naming routes/models, or checking whether a feature belongs to this app.
---

# FlashCart Overview

FlashCart is an e-commerce application.

## Features

### Authentication
- Login / Logout
- Registration

### Catalog
- Products listing
- Categories listing and filtering
- Each category contains its own set of products
- Brands

### User Management
- Password reset
- Forgot password
- Addresses: add, edit, remove

## Notes

- These are the core features of the app; keep new work consistent with them.
- Category ↔ Product is a one-to-many relationship: a category has multiple
  products, and a product belongs to a category.
- Brands are a separate concept from categories — a product can be associated
  with a brand.
