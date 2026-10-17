# Project Specification Template

[![License: MIT](https://img.shields.io/badge/License-MIT-ff5500.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-1a1a1f.svg)](#)
[![Build](https://img.shields.io/badge/build-no--build--step-success.svg)](#usage)

A foundational, **GitHub Pages–ready** project structure that serves as a
starting point for building software applications. It ships with a complete,
token-driven design system (the *CPS Learning App* landing page), accessible
markup, scroll-reveal animations, and skeleton loading — all in plain HTML, CSS,
and JavaScript with **no build step required**.

Clone the repository, open `index.html`, and you have a working, deployable site
from the very first commit.

## Getting Started

### Prerequisites

You need very little to work with this template:

- A **modern web browser** (Chrome, Firefox, Safari, or Edge) — required.
- **git** — to clone the repository and manage version control.
- _Optional:_ **Python 3** or **Node.js** — only if you want to serve the site
  over HTTP locally (recommended, so relative paths and fonts resolve exactly as
  they will in production).

There are **no dependencies to install** and **no toolchain to configure** — the
project runs directly in the browser.

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd proj_902-project-specification-template
   ```

2. **Open the site**

   The fastest path is to open the entry file directly in your browser:

   ```bash
   # macOS
   open index.html
   # Windows
   start index.html
   # Linux
   xdg-open index.html
   ```

   For the most production-accurate experience, serve it over a local HTTP
   server instead (see [Usage](#usage) below).

## Usage

### Running locally

Opening `index.html` works, but serving over HTTP avoids `file://` quirks and
matches how GitHub Pages behaves. Use whichever runtime you already have:

```bash
# Python 3 (no install needed on most systems)
python -m http.server 8000

# Node.js (via npx, no global install)
npx serve .
```

Then visit <http://localhost:8000> in your browser. Edit the files in `src/` and
refresh — there is nothing to recompile.

### Deploying to GitHub Pages

Because the project has a flat root (`index.html` at the top level) and no build
step, deployment is a two-step process:

1. Push your changes to the `main` branch:

   ```bash
   git push origin main
   ```

2. In your repository on GitHub, go to **Settings → Pages**, set **Source** to
   *Deploy from a branch*, choose the **`main`** branch and the **`/ (root)`**
   folder, then **Save**.

Your site will be published at `https://<username>.github.io/<repository>/`
within a minute or two. Every subsequent push to `main` redeploys automatically.

## Directory Structure

```
.
├── index.html          # Entry point — semantic page markup, loads src/ assets
├── LICENSE             # MIT license text
├── README.md           # This file
├── .gitignore          # Version-control hygiene
├── src/                # Application source
│   ├── styles.css      # Design-system stylesheet (tokens + components)
│   └── app.js          # Vanilla ES6+ interactive behaviour
├── assets/             # Static media (images, icons, fonts, Open Graph art)
└── docs/               # Project documentation
    ├── ARCHITECTURE.md   # Design decisions and system structure
    ├── CUSTOMIZATION.md  # Step-by-step customization guide
    └── CONTRIBUTING.md   # Contribution guidelines
```

- **`index.html`** — the single HTML entry point. Kept at the repository root so
  GitHub Pages can serve it with no configuration.
- **`src/`** — application source code: the stylesheet and the interactive
  JavaScript. This is where the bulk of your project's logic lives.
- **`assets/`** — static assets such as images, icons, fonts, and social-sharing
  artwork referenced by the application.
- **`docs/`** — project documentation, guides, and design notes that go beyond
  this README.

## Features

- **Responsive design** — mobile-first layout with breakpoints at 768px and
  1024px; grids collapse gracefully on small screens.
- **Design system with tokens** — colors, spacing, radius, and fluid typography
  are defined once as CSS custom properties in `:root`, so re-theming is a
  single-file change.
- **Accessible markup** — semantic HTML, a skip link, ARIA attributes, visible
  focus states, and 44×44px minimum touch targets.
- **Scroll-triggered reveals** — sections animate into view via the
  Intersection Observer API and degrade gracefully without JavaScript.
- **Skeleton loading** — shimmering placeholders demonstrate the
  perceived-performance pattern for content fetched after first paint.
- **Responsive navigation** — a mobile menu toggle with `aria-expanded`,
  outside-click dismissal, and Escape-to-close keyboard support.
- **Zero build step** — plain HTML, CSS, and JavaScript; deploy straight to
  GitHub Pages with no bundler or CI/CD.
- **Reduced-motion, high-contrast, and print** support baked into the stylesheet.

## Customization

The design is driven entirely by CSS custom properties, so most look-and-feel
changes come down to editing a handful of variables in `src/styles.css`. To
change colors, swap fonts, adjust spacing, add new sections, or extend the
JavaScript, see the detailed, step-by-step guide:

➡️ **[docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md)**

## Technologies

- **HTML5** — semantic, accessible markup.
- **CSS3** — custom properties, `clamp()` fluid typography, CSS Grid and
  Flexbox, media queries, and keyframe animations.
- **JavaScript (ES6+)** — vanilla, dependency-free, wrapped in an IIFE; uses the
  Intersection Observer and `matchMedia` APIs.
- **Google Fonts** — *Inter* (400/600/700) and *Manrope* (900), loaded via CDN.

## Contributing

Contributions are welcome! Please read the full guidelines — covering bug
reports, feature requests, the pull-request process, coding standards, and
commit conventions — before you start:

➡️ **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)**

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE)
file for the full license text.
