# Contributing to Project Specification Template

👋 **Welcome, and thank you for your interest in contributing!** Whether you are
fixing a typo, reporting a bug, proposing a feature, or submitting your first
pull request, your help makes this template better for everyone. This guide
explains how to get involved and what to expect.

No contribution is too small — documentation fixes and accessibility
improvements are every bit as valuable as new features.

## Code of Conduct

We are committed to a welcoming, harassment-free experience for everyone,
regardless of background or experience level. Be kind, be respectful, assume good
intent, and give constructive feedback. By participating, you agree to uphold
these standards. Please report unacceptable behavior by opening a confidential
issue or contacting a maintainer directly.

## How to Contribute

There are many ways to help:

- 🐛 **Report bugs** you encounter.
- 💡 **Suggest features** or improvements.
- 📝 **Improve documentation** (README, the `docs/` guides, inline comments).
- 🔧 **Submit pull requests** that fix bugs or add functionality.
- ✅ **Review open pull requests** and test proposed changes.

If you are unsure where to start, open an issue describing what you would like to
work on — we are happy to point you in the right direction.

## Reporting Bugs

Before filing a bug, please search existing issues to avoid duplicates. When you
open a new bug report, include the following so we can reproduce it quickly:

```markdown
**Describe the bug**
A clear, concise description of what went wrong.

**Steps to reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened (include screenshots if helpful).

**Environment**
- OS: [e.g. Windows 11, macOS 14]
- Browser & version: [e.g. Chrome 120, Firefox 121]
- Device: [e.g. Desktop, iPhone 14]
```

## Suggesting Features

Have an idea? We would love to hear it. Open a feature request that explains the
*problem* first, then your proposed solution:

```markdown
**Use case / problem**
What are you trying to do, and what is getting in the way?

**Proposed solution**
How you imagine it working.

**Alternatives considered**
Other approaches you thought about and why you set them aside.

**Additional context**
Mockups, links, or examples that help illustrate the idea.
```

> 📝 Keep in mind that this is a deliberately minimal, no-build template. Features
> that preserve the "clone and deploy" simplicity are the easiest to accept.

## Pull Request Process

1. **Fork** the repository to your own account.
2. **Create a branch** from `main` with a descriptive name:

   ```bash
   git checkout -b fix/mobile-nav-focus
   ```

3. **Make your changes**, following the [Coding Standards](#coding-standards)
   below.
4. **Test locally** (see [Development Setup](#development-setup) and the
   [Testing Checklist](#testing-checklist)).
5. **Commit** using the [commit conventions](#commit-message-conventions).
6. **Push** your branch and **open a pull request** against `main` with a clear
   description of what changed and why.

A good PR description looks like this:

```markdown
## What
Fix focus not returning to the nav toggle after closing the mobile menu.

## Why
Keyboard users were left with focus trapped inside the collapsed menu,
failing WCAG 2.4.3 (Focus Order).

## How
Call `toggle.focus()` in the Escape-key handler after `setMenu(false)`.

## Testing
- Verified with keyboard only in Chrome and Firefox at 375px width.
- Confirmed no console errors.
```

> 📝 Keep pull requests focused — one logical change per PR is far easier to
> review and merge than a large, mixed one.

## Development Setup

Setup mirrors the README's *Getting Started*. You need only a modern browser and
`git`; Python or Node are optional for local serving.

```bash
# 1. Clone your fork
git clone <your-fork-url>
cd proj_902-project-specification-template

# 2. Serve locally (optional but recommended)
python -m http.server 8000
#   — or —
npx serve .
```

Then open <http://localhost:8000>. There are no dependencies to install and no
build step to run — edit the files in `src/` and refresh the browser.

## Coding Standards

Please match the existing style of the codebase.

**HTML**

- Use **semantic markup** — landmarks (`<header>`, `<main>`, `<nav>`,
  `<footer>`), headings in order, and meaningful elements.
- Maintain **accessibility**: descriptive `alt` text, correct ARIA attributes,
  labelled sections (`aria-labelledby`), and keyboard operability.
- Keep attributes and indentation consistent with `index.html`.

**CSS**

- Follow the existing **BEM-style** naming (`.block__element--modifier`), e.g.
  `.card__title`, `.btn--primary`, `.site-footer__link`.
- Write **mobile-first** rules; layer larger screens with `min-width` queries.
- Use the **design tokens** (`var(--color-*)`, `var(--spacing-*)`,
  `var(--radius-*)`) instead of hard-coded values.
- Place new rules in the appropriate numbered section of `src/styles.css`.

**JavaScript**

- Write modern **ES6+**; keep everything inside the existing IIFE under
  `'use strict'`.
- **No global namespace pollution** — do not attach to `window`.
- Add **JSDoc comments** for new functions, matching the existing style.
- Follow the module pattern: small `init*` functions registered in the `modules`
  array, each resilient within its own `try/catch`.

## Commit Message Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/). Each message
starts with a type, an optional scope, and a short imperative description:

```
<type>(<optional scope>): <description>
```

**Types:**

| Type       | Use for                                             |
| ---------- | --------------------------------------------------- |
| `feat`     | A new feature                                       |
| `fix`      | A bug fix                                            |
| `docs`     | Documentation-only changes                          |
| `style`    | Formatting / whitespace (no behavior change)        |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test`     | Adding or correcting tests                          |
| `chore`    | Tooling, config, or maintenance                     |

**Examples of good commit messages:**

```
feat(nav): add back-to-top button with reduced-motion support
fix(nav): return focus to toggle after closing mobile menu
docs(readme): add GitHub Pages deployment steps
style(css): align design-token declarations
refactor(app): extract skeleton reveal into its own helper
chore: add .editorconfig
```

## Testing Checklist

This is a static project, so testing is manual. Before opening a PR, please
verify:

- [ ] **Valid HTML** — run it through the [W3C validator](https://validator.w3.org/).
- [ ] **Responsive** — check mobile (~375px), tablet (768px), and desktop
      (1024px+); grids and navigation adapt correctly.
- [ ] **Accessibility** — navigate with the keyboard only (Tab, Enter, Escape),
      confirm visible focus, check color contrast, and test with reduced motion
      enabled.
- [ ] **Cross-browser** — verify in at least Chrome, Firefox, and Safari (or
      Edge).
- [ ] **No console errors or warnings** in the browser DevTools.

## Documentation Updates

**Documentation is part of the change, not an afterthought.** If your
contribution changes behavior, structure, tokens, or usage, update the relevant
docs in the same pull request:

- User-facing changes → update `README.md`.
- Design decisions or structure → update `docs/ARCHITECTURE.md`.
- Anything that affects how users customize the template → update
  `docs/CUSTOMIZATION.md`.

PRs that change functionality without updating affected documentation may be
asked to add it before merge.

## Review Process

Once you open a pull request:

1. A **maintainer reviews** your changes, usually within a few days.
2. You may receive **feedback or change requests** — this is a normal,
   collaborative part of the process. Push follow-up commits to the same branch;
   the PR updates automatically.
3. Once the PR meets the **merge criteria** — it addresses a clear need, follows
   the coding standards, passes the testing checklist, and includes any needed
   documentation — a maintainer will approve and merge it.

Thank you again for contributing. We are glad you are here! 🎉
