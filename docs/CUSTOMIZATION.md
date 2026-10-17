# Customization Guide

This guide walks you through the most common customizations, from recoloring the
template to adding entirely new sections and functionality. Because the design is
**token-driven**, most visual changes come down to editing a few CSS custom
properties in `src/styles.css`.

Each section uses numbered steps and before/after examples. Watch for the
**⚠️ Warning** and **📝 Note** callouts — they flag common pitfalls.

> 📝 **Note:** All design tokens live in the `:root { … }` block at the top of
> `src/styles.css`. Editing them cascades across every component automatically.

## Changing Colors

All colors are declared once as CSS custom properties and referenced everywhere
via `var(--color-*)`. Change the variable, and every component updates.

### Color variables

| Variable                   | Purpose                                   |
| -------------------------- | ----------------------------------------- |
| `--color-white`            | Base white surface                        |
| `--color-accent`           | Primary brand/accent color                |
| `--color-accent-hover`     | Accent on hover                           |
| `--color-accent-active`    | Accent on active/pressed                  |
| `--color-accent-soft`      | Tinted accent background                  |
| `--color-text`             | Primary text (near-black)                 |
| `--color-text-muted`       | Secondary / muted text                    |
| `--color-surface`          | Default surface background                |
| `--color-surface-alt`      | Alternating section background            |
| `--color-border`           | Borders and dividers                      |
| `--color-skeleton`         | Skeleton placeholder base                 |
| `--color-skeleton-sheen`   | Skeleton shimmer highlight                |

### Steps

1. Open `src/styles.css` and locate the `:root` block.
2. Change `--color-accent` to your brand color.
3. Update the derived accent states (`-hover`, `-active`, `-soft`) to match, so
   interactive states stay visually consistent.

**Before:**

```css
:root {
  --color-accent: #ff5500;
  --color-accent-hover: #e64d00;
  --color-accent-active: #cc4400;
  --color-accent-soft: #fff1ea;
}
```

**After (switching to a blue brand):**

```css
:root {
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-accent-active: #1e40af;
  --color-accent-soft: #eaf1ff;
}
```

> ⚠️ **Warning:** Keep contrast accessible. Body text needs a 4.5:1 contrast
> ratio against its background, and large text needs 3:1. If you darken
> `--color-surface` or lighten `--color-text`, re-check contrast with a tool like
> the browser DevTools contrast checker.

## Modifying Typography

Typography comes from two places: the **Google Fonts link** in `index.html` and
the **font/size tokens** in `src/styles.css`.

### 1. Change the fonts

1. Pick your fonts on [Google Fonts](https://fonts.google.com) and copy the
   generated `<link>`.
2. Replace the existing link in `index.html` (`<head>`).

**Before:**

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Manrope:wght@900&display=swap"
  rel="stylesheet"
/>
```

**After (Roboto body + Poppins headings):**

```html
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Poppins:wght@700;900&display=swap"
  rel="stylesheet"
/>
```

3. Update the font-family tokens in `src/styles.css`:

```css
:root {
  --font-inter: "Roboto", system-ui, -apple-system, sans-serif;
  --font-manrope: "Poppins", var(--font-inter);
}
```

> ⚠️ **Warning:** Always keep the system-font fallbacks (`system-ui`, `sans-serif`)
> at the end of the stack so text still renders if the CDN fails. Make sure the
> font weights you request in the link (e.g. `700;900`) match the weights your
> CSS actually uses.

### 2. Adjust sizes and weights

Font sizes are fluid via `clamp(min, preferred, max)`. Adjust the three values to
change how type scales across viewports.

**Before:**

```css
--font-size-hero: clamp(2.5rem, 1.5rem + 5vw, 4.5rem); /* 40–72px */
```

**After (larger hero):**

```css
--font-size-hero: clamp(3rem, 2rem + 6vw, 5.5rem); /* 48–88px */
```

Headings use `font-weight: 900` (Manrope) by default; change the weight on the
`h1, h2, h3, h4` rule to lighten them.

## Adjusting Spacing

Spacing uses a fixed scale mirroring the Figma design (2 / 4 / 6 / 8 / 12 / 24
px), plus a fluid `--spacing-section` for vertical section rhythm.

| Variable            | Value     | Typical use                        |
| ------------------- | --------- | ---------------------------------- |
| `--spacing-2`       | 2px       | Hairline gaps                      |
| `--spacing-4`       | 4px       | Tight inset spacing                |
| `--spacing-6`       | 6px       | Small gaps                         |
| `--spacing-8`       | 8px       | Default small gap / inset          |
| `--spacing-12`      | 12px      | Medium gap, button padding (block) |
| `--spacing-24`      | 24px      | Large gap, container inset, grids  |
| `--spacing-section` | fluid     | Vertical padding between sections  |

### Steps

1. To change a global spacing step, edit the token value.
2. To change section rhythm, edit `--spacing-section` (it uses `clamp()`).

**Before:**

```css
--spacing-24: 1.5rem; /* 24px */
--spacing-section: clamp(4rem, 2rem + 8vw, 7.5rem);
```

**After (roomier layout):**

```css
--spacing-24: 2rem; /* 32px */
--spacing-section: clamp(5rem, 3rem + 8vw, 9rem);
```

> 📝 **Note:** Prefer `var(--spacing-*)` over hard-coded pixel values in new
> rules. This keeps rhythm consistent and makes global adjustments possible from
> one place. Use the smaller steps (2–8px) for insets and the larger steps
> (12–24px) for gaps between components.

## Modifying Border Radius

Corner rounding uses a four-step scale plus a pill value.

| Variable        | Value   | Typical use                     |
| --------------- | ------- | ------------------------------- |
| `--radius-8`    | 8px     | Small elements, skip link       |
| `--radius-12`   | 12px    | Buttons                         |
| `--radius-16`   | 16px    | Cards, testimonials             |
| `--radius-24`   | 24px    | Large panels (CTA)              |
| `--radius-pill` | 9999px  | Fully rounded (avatars, pills)  |

### Steps

1. Edit the relevant `--radius-*` token to make corners sharper or softer.

**Before:**

```css
--radius-16: 1rem; /* 16px — cards */
```

**After (sharper cards):**

```css
--radius-16: 0.5rem; /* 8px — cards */
```

## Adding New Sections

New static sections require **no JavaScript**. Follow the existing HTML pattern
and reuse the system classes.

### Steps

1. In `index.html`, add a `<section>` with a unique `id` and an
   `aria-labelledby` pointing at its heading.
2. Wrap content in `.container` for consistent width and padding.
3. Add `data-aos="fade-up"` to any element you want revealed on scroll.
4. Reuse `.section--alt` to alternate the background color.

**Example — a new "Pricing" section:**

```html
<section class="section section--alt" id="pricing" aria-labelledby="pricing-heading">
  <div class="container">
    <div class="section__header" data-aos="fade-up">
      <span class="eyebrow">Pricing</span>
      <h2 id="pricing-heading">Simple, transparent pricing</h2>
      <p class="lead">Start free. Upgrade when you are ready.</p>
    </div>

    <div class="grid feature-grid">
      <article class="card" data-aos="fade-up">
        <h3 class="card__title">Starter</h3>
        <p class="card__text">Everything you need to launch.</p>
      </article>
      <!-- more cards… -->
    </div>
  </div>
</section>
```

5. (Optional) Add a nav link in the header:

```html
<li><a class="main-nav__link" href="#pricing">Pricing</a></li>
```

> 📝 **Note:** Reveal-on-scroll works automatically — `app.js` observes every
> `[data-aos]` element on load, including ones you add. No JS edit is needed.

> ⚠️ **Warning:** Keep `id` values unique and match each `aria-labelledby` to the
> heading's `id`. Duplicate IDs break both anchors and assistive technology.

## Customizing Content

### Editing text

Open `index.html` and edit the copy directly inside the elements — headings
(`.hero__title`, `.card__title`), body copy (`.lead`, `.card__text`), and the
footer. There is no templating layer; what you type is what renders.

### Adding images

1. Place image files in the `assets/` folder, **or** reference a hosted image.
2. Always include a descriptive `alt` attribute, `width`/`height` to prevent
   layout shift, and `loading="lazy"` for below-the-fold images.

**Example using an Unsplash image:**

```html
<img
  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80"
  alt="Developer working at a laptop"
  width="1200"
  height="800"
  loading="lazy"
  decoding="async"
/>
```

Or reference a local asset:

```html
<img src="assets/hero.jpg" alt="Product screenshot" width="1200" height="800" />
```

### Updating links

Replace the `href` values on `.main-nav__link`, `.btn`, and `.site-footer__link`
elements. In-page links (starting with `#`) get smooth scrolling automatically;
external links work as normal anchors.

> ⚠️ **Warning:** An empty `alt=""` is correct only for purely decorative images
> (like the testimonial avatars). Meaningful images must have descriptive alt
> text for accessibility.

## Extending Functionality

New behavior goes in `src/app.js`. Follow the existing module pattern: write a
small `init*` function and register it in the `modules` array inside `init()` so
it gets its own `try/catch` isolation.

### Steps

1. Write an initializer function.
2. Add it to the `modules` array in `init()`.

**Before:**

```js
const init = () => {
  const modules = [
    initScrollReveals,
    initSmoothScroll,
    initNavToggle,
    initSkeletonLoading,
  ];
  // …
};
```

**After — adding a "back to top" button:**

```js
const initBackToTop = () => {
  const button = document.querySelector('[data-back-to-top]');
  if (!button) return;
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
};

const init = () => {
  const modules = [
    initScrollReveals,
    initSmoothScroll,
    initNavToggle,
    initSkeletonLoading,
    initBackToTop,
  ];
  // …
};
```

### API integrations

To fetch real data (for example, to replace the skeleton demo), use the native
`fetch` API inside an initializer and handle errors explicitly:

```js
const loadResources = async () => {
  try {
    const response = await fetch('https://api.example.com/resources');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    // render data, then hide the skeleton group…
  } catch (error) {
    console.error('[CPS] Failed to load resources:', error);
    // show an error state — do NOT leave the skeleton spinning forever
  }
};
```

> ⚠️ **Warning:** Keep all code inside the existing IIFE and `'use strict'`. Do
> not attach variables to `window`; the template deliberately avoids global
> namespace pollution. Always handle fetch failures — never leave a skeleton in
> its loading state on error.

## Changing Layout

### Grid and flexbox

Column counts are defined per breakpoint. To change how many cards appear per
row, edit the `grid-template-columns` values.

**Before:**

```css
@media (min-width: 1024px) {
  .feature-grid { grid-template-columns: repeat(3, 1fr); }
}
```

**After (four columns on desktop):**

```css
@media (min-width: 1024px) {
  .feature-grid { grid-template-columns: repeat(4, 1fr); }
}
```

Horizontal groupings (like button rows) use the `.cluster` flex utility; adjust
its `gap` via the token or override it on a specific element.

### Responsive breakpoints

The template uses two `min-width` breakpoints (768px, 1024px) plus one
`max-width: 767px` query for the mobile nav. To add a breakpoint, duplicate an
existing media query with your new width.

> ⚠️ **Warning:** This stylesheet is **mobile-first** — base rules target small
> screens and `min-width` queries enhance upward. If you add a breakpoint, keep
> the mobile defaults outside the query and layer larger-screen overrides inside
> it, so small screens never pay for desktop styles.

## Advanced: Adding Build Tools

The template runs with **no build step by design** — that is what makes it deploy
to GitHub Pages instantly. You only need build tooling if you later want
features like SCSS, TypeScript, asset hashing, or automatic minification.

If you decide to add a bundler (entirely optional):

1. Initialize a package manifest:

   ```bash
   npm init -y
   ```

2. Install a zero-config bundler such as [Vite](https://vitejs.dev):

   ```bash
   npm install --save-dev vite
   ```

3. Add scripts to `package.json`:

   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

4. Run the dev server with `npm run dev`, and produce a production bundle with
   `npm run build` (output defaults to `dist/`).

> ⚠️ **Warning:** Introducing a build step changes your deployment model. With a
> bundler, GitHub Pages must serve the **built output** (e.g. `dist/`), not the
> root — you will typically need a GitHub Actions workflow to build and publish.
> Only add tooling when a concrete need justifies the extra complexity; the
> template works perfectly without it.
