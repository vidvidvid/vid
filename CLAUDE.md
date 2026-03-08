# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/creative website for "vidvidvid" with sections for Code, Music, Imagery, and Words. Built with Next.js 13 (Pages Router), Chakra UI v2, and Three.js for 3D effects.

## Commands

- **Dev server:** `npm run dev`
- **Build (static export):** `npm run build-prod` (cleans, builds, exports to `out/`)
- **Lint:** `npm run lint`
- **Format:** `npm run format`
- **Type check:** `npm run check-types`
- **Commit (interactive):** `npm run commit` (uses commitizen with conventional commits)

## Architecture

- **Pages Router:** `src/pages/` — index (landing), code, music, imagery, words
- **Layout:** `src/templates/Main.tsx` — shared layout with fixed nav bar (hidden on home page) and centered content
- **Meta/SEO:** `src/layouts/Meta.tsx` — wraps next-seo
- **Theme:** `src/utils/theme.ts` — Chakra UI extended theme, forced dark mode, Sono font, custom green/purple/yellow color scales
- **3D scenes:** `src/components/3js/` — Three.js components via @react-three/fiber and drei
- **Static assets:** `src/static/` for CSS and fonts; `public/` for images

## Key Conventions

- TypeScript with strict mode (`noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`)
- Path aliases: `@/*` → `./src/*`, `@/public/*` → `./public/*`
- Conventional commits enforced via commitlint and husky
- Lint-staged runs ESLint fix + type checking on commit
- Deployed to Netlify (static export)
- Always dark mode — `ForceDarkMode` wrapper in `_app.tsx`
