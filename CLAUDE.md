# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## REGLA OBLIGATORIA — Consultar /docs antes de generar código

**Antes de escribir cualquier línea de código**, Claude Code DEBE leer y aplicar la documentación relevante del directorio `/docs`. Esta regla no tiene excepciones.

Pasos obligatorios:
1. Identificar qué archivos de `/docs` aplican a la tarea (UI, base de datos, autenticación, etc.).
2. Leer esos archivos con la herramienta Read.
3. Generar código que cumpla estrictamente con lo especificado en esa documentación.
4. Archivos Relevantes:
    * /docs/ui.md

Documentación disponible:

| Archivo | Aplica cuando… |
|---|---|
| `docs/ui.md` | Se crea o modifica cualquier componente visual |

## Commands

```bash
npm run dev      # Start dev server (uses Turbopack by default)
npm run build    # Production build (uses Turbopack by default)
npm run start    # Start production server
npx eslint .     # Lint (next lint was removed in v16 — use eslint directly)
```

`next build` does **not** run linting automatically in v16.

## Stack

- **Next.js 16.2.1** — App Router, Turbopack by default
- **React 19.2.4** — Server Components by default; add `'use client'` only when needed
- **TypeScript 5** — strict mode, path alias `@/*` → project root
- **Tailwind CSS v4** — configured via `@tailwindcss/postcss`, no `tailwind.config.*` needed
- @clerk/nextjs ^7.0.7 — autenticación
- @neondatabase/serverless ^1.0.2 + drizzle-orm ^0.45.2 — base de datos
- drizzle-kit ^0.31.10 — migraciones
- shadcn/ui (@base-ui/react, class-variance-authority, clsx, tailwind-merge)

## Base de datos
- Proveedor: Neon
- ORM: Drizzle
- Schema en: /db/schema.ts (o donde esté)

## Architecture
All routes live under `app/`. Pages are Server Components unless marked `'use client'`. The root layout (`app/layout.tsx`) wraps all routes and sets fonts/metadata.

Route file conventions:
- `page.tsx` — renders a URL segment
- `layout.tsx` — wraps child segments
- `loading.tsx` — streaming skeleton
- `error.tsx` — error boundary
- `route.ts` — API endpoint (REST handler)

Private/non-routable files go in `_folder` subdirectories (e.g. `app/workouts/_components/`).

## Next.js v16 Breaking Changes

Read `node_modules/next/dist/docs/` before making changes. Key removals from v15:

| Removed | Replacement |
|---|---|
| `next lint` CLI command | `npx eslint .` |
| `serverRuntimeConfig` / `publicRuntimeConfig` | `process.env` in Server Components; `NEXT_PUBLIC_` prefix for client |
| `experimental.dynamicIO` flag | `cacheComponents: true` in `next.config.ts` |
| `middleware.ts` convention | `proxy.ts` |
| AMP support (`next/amp`, `useAmp`) | Removed entirely |
| `--turbopack` flag | Turbopack is now the default; use `--webpack` to opt out |

For runtime env vars (read at request time, not bundled): call `await connection()` from `next/server` before accessing `process.env`.

For slow client-side navigations: Suspense alone is insufficient — also export `unstable_instant` from the route. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.
