# Chakra UI to CSS Modules Migration

## Overview

Migrate the portfolio site from Chakra UI v3 to pure CSS Modules with native HTML elements. 15 files affected, ~20 Chakra components to replace.

## Color System

CSS custom properties in `src/styles/globals.css`. New custom palette:

- **Green → Teal-mint:** `#0fd9a6`, `#0bb88a`, `#099e73`, etc.
- **Purple → Violet-indigo:** `#a78bfa`, `#8b5cf6`, `#7c3aed`, etc.
- **Yellow → Amber-gold:** `#fbbf24`, `#f59e0b`, `#d97706`, etc.
- **Alpha colors:** `rgba(255,255,255,*)` and `rgba(0,0,0,*)` as custom properties

## Component Mapping

| Chakra | Replacement |
|--------|-------------|
| Box, Flex, VStack, HStack, Stack, Grid, SimpleGrid | `<div>` + CSS classes |
| Text | `<p>` / `<span>` |
| Image | `<img>` / Next.js Image |
| Link | `<a>` / Next.js Link |
| Button | `<button>` |
| Badge, Code | `<span>` with styles |
| AspectRatio | CSS `aspect-ratio` |
| Dialog | Native `<dialog>` + portal |
| Drawer | Native `<dialog>` + slide-in animation + portal |
| Portal | React `createPortal` |

## Responsive Breakpoints

```css
@media (min-width: 480px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 992px)  { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

## File Structure

```
src/
  styles/
    globals.css           -- colors, fonts, resets, dark mode
  pages/
    index.module.css
    code.module.css
    music.module.css
    words.module.css
  components/
    Card.module.css
    CodeCard.module.css
    Footer.module.css
    Gallery.module.css
    Reader.module.css
    EpilepsyTrigger.module.css
    StripButton.module.css
    CountdownTimer.module.css
  templates/
    Main.module.css
```

## Removed

- All `@chakra-ui/*` packages
- `src/utils/theme.ts`
- ChakraProvider from `_app.tsx`

## Preserved

- `src/static/frame.css` (animations)
- Three.js components
- All existing layout and functionality
