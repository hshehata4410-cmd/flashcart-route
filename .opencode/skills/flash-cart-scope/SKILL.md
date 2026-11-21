---
name: flash-cart-scope
description: Project scope rule for this workspace — all main work happens under flash_cart. Use when starting any task, creating or editing files, running commands, or when a request could apply to more than one project in the workspace.
---

# Flash Cart Scope

All main work in this workspace happens under the `flash_cart` project.

## Rules

- Treat `/Users/ahmedelsherif/test_apps/flash_cart` as the root of the project being worked on.
- Read, create, and edit files only inside `flash_cart` unless the user explicitly asks for another directory.
- Run commands (`npm`, `git`, tests, dev server) with `flash_cart` as the working directory.
- Do not modify sibling projects such as `nextjs_e_commerce`, `e_commerce`, `rn_playground_*`, etc.
- If a request seems to target a different project, confirm with the user before touching anything outside `flash_cart`.

## Dev server

- Keep the dev server (`npm run dev`) running at all times once started.
- **Never stop, kill, or restart it** unless the user explicitly asks.
- If it is not running when work starts, start it in the background and leave it running.
- Stop only on an explicit user request, e.g. "stop the dev server".

