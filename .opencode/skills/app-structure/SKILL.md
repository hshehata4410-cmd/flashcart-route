---
name: app-structure
description: Folder structure rules for FlashCart — a src folder at the project root, components under src/components, primitive components inside src/components/ui, shared components (Navbar, etc.) as folders with their sub-components, utils, and types, and a src/features folder with one folder per big feature (auth, products, categories) each holding components/, utils/, and types/. Use when creating a new file or component, moving or grouping code, or deciding where a component belongs.
---

# App Structure

How folders are laid out in this project.

## Layout

```text
src/
├── components/
│   ├── ui/           # primitive components
│   └── Navbar/       # shared component folder
└── features/
    ├── auth/         # feature folder
    │   ├── components/
    │   ├── utils/
    │   └── types/
    ├── products/
    │   ├── components/
    │   ├── utils/
    │   └── types/
    └── categories/
        ├── components/
        ├── utils/
        └── types/
```

- The project root contains a `src` folder; source code lives inside it.
- Components live under `src/components`.
- `src/components/ui` holds the most primitive components — the smallest,
  reusable building blocks such as `Input`, `Label`, `Button`, etc.

## Primitive components

Put new primitive components in `src/components/ui`.

## Shared components

Shared components, such as `Navbar`, stay directly under
`src/components` — not inside `ui`.

When a shared component has underlying components of its own (for example
`Navbar`'s upper and lower sections), keep them inside that component's
folder. The same folder holds the component's utils and types:

```text
src/components/Navbar/
├── Navbar.tsx
├── Lower.tsx
├── Upper.tsx
├── utils.ts        # optional
└── types.ts        # optional
```

- **Sub-components** go in the component's folder (`Lower.tsx`, `Upper.tsx`).
- **Utils** for the component go in the same folder (`utils.ts`).
- **Types** for the component go in the same folder (`types.ts`).
- **Component props types** are the exception: keep them with their
  associated component file (for example `NavbarProps` stays in
  `Navbar.tsx`), not in `types.ts`.
- `utils.ts` and `types.ts` are optional — only create them when actually
  needed.

## Features

`src/features` holds one folder per big feature of the app, for example
`auth`, `products`, and `categories`.

Every feature folder has the same three subfolders:

```text
src/features/auth/
├── components/
├── utils/
└── types/
```

- `components/` — components that belong to this feature.
- `utils/` — helpers used by this feature.
- `types/` — types used by this feature.

## Unsure where something belongs?

When adding a new component and you are not sure where it belongs, **ask
the user first** instead of guessing or creating a new folder.
