# Architecture Overview

This document explains *why* the **Project Specification Template** is built the
way it is. The goal of the template is to give developers a clean, accessible,
deployment-ready foundation — the *CPS Learning App* landing page — that works in
the browser from the first commit, with **no build step, no toolchain, and no
runtime dependencies**.

The guiding principle throughout is **progressive enhancement**: the page is
fully functional as static HTML and CSS, and JavaScript layers interactivity on
top without ever becoming a requirement for the content to be readable.

## Design Principles

- **Simplicity first.** Fewer moving parts means less to learn, less to break,
  and faster onboarding. The entire app is three source files.
- **No build tools.** Plain HTML/CSS/JS ships directly to GitHub Pages. There is
  nothing to compile, bundle, or transpile.
- **Browser-ready.** Open `index.html` and it works. Serving over HTTP is
  optional, not mandatory.
- **Accessibility by default.** Semantic markup, a skip link, ARIA state,
  visible focus, keyboard support, and reduced-motion handling are built in — not
  bolted on.
- **Performance by default.** Minimal payload, CDN-hosted fonts with
  `preconnect`, lazy-loaded images, and GPU-friendly animations.

## File Organization

The project uses a **flat root** so GitHub Pages can serve `index.html` with
zero configuration, while source and documentation are grouped into predictable
folders.

```
proj_902-project-specification-template/
├── index.html          ← entry point (must stay at root for GitHub Pages)
│
├── src/                ← application source
│   ├── styles.css      ← design tokens + component styles (single stylesheet)
│   └── app.js          ← vanilla ES6+ behaviour (IIFE, no globals)
│
├── assets/             ← static media: images, icons, fonts, OG artwork
│
├── docs/               ← documentation
│   ├── ARCHITECTURE.md ← this file
│   ├── CUSTOMIZATION.md
│   └── CONTRIBUTING.md
│
├── LICENSE             ← MIT
├── README.md           ← project overview & getting started
└── .gitignore
```

- **Flat structure for GitHub Pages** — `index.html` lives at the repository
  root so Pages (`/ (root)` source) resolves it as the site index automatically.
- **`src/`** — all editable application source. Keeping CSS and JS out of the
  root keeps the top level uncluttered while the relative paths
  (`src/styles.css`, `src/app.js`) remain short and stable.
- **`assets/`** — every binary/media reference (favicons, Open Graph images,
  avatars) lives here, separate from code.
- **`docs/`** — long-form documentation that would overwhelm the README.

## Technology Choices

**Why vanilla HTML/CSS/JS?**
A template's job is to *start* projects, not to impose a framework on them.
Vanilla technologies have no version churn, no dependency audit, and no build
configuration. The result deploys anywhere static files are served and remains
readable years later.

**Why Google Fonts via CDN?**
*Inter* and *Manrope* give a strong, minimalist type hierarchy without shipping
font binaries in the repo. Loading them from the Google Fonts CDN keeps the
payload small and benefits from edge caching. The template uses `preconnect`
hints and `display=swap` so text renders immediately with a system fallback:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Manrope:wght@900&display=swap"
  rel="stylesheet"
/>
```

**Why a single CSS file?**
One stylesheet means one HTTP request and one place to look. At this scale,
splitting CSS across many files would add network overhead and cognitive cost
without any maintainability gain. The file is internally organized into clearly
numbered sections (tokens, reset, typography, layout, components, responsive,
motion, print).

## Design System

The design system is **token-driven**. Every color, spacing step, radius, and
type size is declared once as a CSS custom property in `:root`, so the entire
look can be re-themed by editing variables in a single place.

```css
:root {
  /* Core brand colors (from Figma) */
  --color-white: #ffffff;
  --color-accent: #ff5500;

  /* Spacing scale (2 / 4 / 6 / 8 / 12 / 24 px) */
  --spacing-8: 0.5rem;
  --spacing-24: 1.5rem;

  /* Border radius scale (8 / 12 / 16 / 24 px) */
  --radius-12: 0.75rem;
  --radius-16: 1rem;

  /* Fluid typography via clamp() */
  --font-size-hero: clamp(2.5rem, 1.5rem + 5vw, 4.5rem);
}
```

Components then consume those tokens rather than hard-coded values:

```css
.btn--primary {
  background-color: var(--color-accent);
  border-radius: var(--radius-12);
  padding: var(--spacing-12) var(--spacing-24);
}
```

**Figma design integration.** The tokens were extracted directly from the source
Figma frame (`figma_2:3`): the white surface and `#FF5500` accent, the
Inter/Manrope pairing, the 2–24px spacing scale, and the 8–24px radius scale.
Keeping these values as named variables preserves the link between design and
code — when the design changes, you update the token, not dozens of rules.

## Responsive Strategy

The CSS is **mobile-first**: base styles target the smallest viewport, and
`min-width` media queries progressively enhance the layout as screen real estate
grows. Grids start single-column and expand.

```css
.feature-grid { grid-template-columns: 1fr; }           /* mobile base */

@media (min-width: 768px) {                              /* tablet */
  .feature-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {                             /* desktop */
  .feature-grid { grid-template-columns: repeat(3, 1fr); }
}
```

- **768px** marks the tablet breakpoint where two-column grids and the full
  horizontal navigation appear (below it, navigation collapses behind the
  toggle via a `max-width: 767px` query).
- **1024px** marks the desktop breakpoint where grids reach their full
  three-column width.

Fluid `clamp()`-based typography fills the gaps *between* breakpoints, so text
scales smoothly rather than jumping at fixed thresholds.

## JavaScript Architecture

**Why vanilla JS?** The interactivity needed — scroll reveals, smooth scrolling,
a nav toggle, and skeleton swapping — is small and well-served by native browser
APIs. A framework would add weight and a build step for no functional gain.

All code lives in `src/app.js`, wrapped in an **IIFE** under `'use strict'` so it
never pollutes the global namespace. It is organized into small, independently
initialized modules, each guarded by its own `try/catch` so one failure cannot
break the rest of the page:

```js
const modules = [
  initScrollReveals,
  initSmoothScroll,
  initNavToggle,
  initSkeletonLoading,
];

modules.forEach((moduleInit) => {
  try {
    moduleInit();
  } catch (error) {
    console.error(`[CPS] Failed to initialise ${moduleInit.name}:`, error);
  }
});
```

**Intersection Observer for animations.** Reveal animations use
`IntersectionObserver` rather than `scroll` event listeners — it is more
performant (the browser batches viewport detection off the main thread),
provides built-in threshold/root-margin controls, and unobserves each element
after its first reveal (`triggerOnce`). When the API is unavailable or the user
prefers reduced motion, every element is shown immediately — content is never
left permanently hidden.

**Event delegation.** Smooth scrolling attaches a *single* click listener to the
document and uses `event.target.closest('a[href^="#"]')` to handle any in-page
anchor, present or future, instead of binding a listener per link:

```js
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  if (scrollToHash(link.getAttribute('href'))) {
    event.preventDefault();
    window.history.replaceState(null, '', link.getAttribute('href'));
  }
});
```

A small `debounce` helper throttles resize handling, and a `DEBUG`-gated `log`
keeps console output silent in production.

## Extensibility

The template is designed to grow without restructuring.

- **Adding a new section.** Copy an existing `<section>` from `index.html`, give
  it a unique `id`, add `data-aos="fade-up"` to any element you want revealed on
  scroll, and reuse existing classes (`.section`, `.container`, `.grid`,
  `.card`). No JavaScript changes are required for a static section.
- **Adding a component.** Define its styles in the appropriate numbered section
  of `src/styles.css` using existing tokens (`var(--spacing-*)`,
  `var(--color-*)`, `var(--radius-*)`) so it inherits the system automatically.
- **Adding a page.** Create a new `.html` file at the root (e.g. `about.html`),
  reuse the same `<head>` links to `src/styles.css` and `src/app.js`, and link
  to it from the navigation. GitHub Pages serves every root-level HTML file.

See **[CUSTOMIZATION.md](CUSTOMIZATION.md)** for concrete, step-by-step recipes.

## Performance Considerations

- **Minimal dependencies.** No frameworks, no bundler runtime — the only
  external resource is the Google Fonts stylesheet.
- **Optimized font loading.** `preconnect` warms the connection before the font
  CSS is requested, and `display=swap` prevents invisible text during load.
- **Lazy loading.** Below-the-fold images declare `loading="lazy"` and
  `decoding="async"`, and specify `width`/`height` to reserve space and avoid
  layout shift (CLS).
- **GPU-friendly animations.** Reveal animations only transition `opacity` and
  `transform`, which the compositor can handle without triggering layout.
- **Deferred script.** `app.js` loads with `defer`, so parsing never blocks the
  initial render.

## Accessibility Approach

- **Semantic HTML.** Landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`),
  headings in order, and meaningful elements (`<article>`, `<figure>`,
  `<blockquote>`, `<time>`) structure the page for assistive technology.
- **Skip link.** A `.skip-link` lets keyboard users jump straight to `#main`.
- **ARIA where it adds meaning.** The nav toggle exposes `aria-expanded` and
  `aria-controls`; skeleton regions use `role="status"` and `aria-busy`.
- **Keyboard navigation.** All interactive elements are focusable, the mobile
  menu closes on Escape and returns focus to the toggle, and anchor targets
  receive focus after smooth scroll.
- **Visible focus.** A global `:focus-visible` outline uses the accent color.
- **Respecting preferences.** `prefers-reduced-motion` disables animations and
  reveals all content; `prefers-contrast: more` strengthens text and borders.
- **Touch targets.** Buttons and the nav toggle meet the 44×44px minimum.
