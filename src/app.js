/**
 * CPS Learning App — Interactive behaviour
 * Project Specification Template
 *
 * Vanilla ES6+, no dependencies, no build step. Wrapped in an IIFE to avoid
 * polluting the global namespace. Implements:
 *   - Scroll-triggered reveal animations (Intersection Observer)
 *   - Smooth scroll for in-page anchor links
 *   - Skeleton loading state removal on load
 *   - Responsive (mobile) navigation toggle with ARIA + keyboard support
 *   - Focus management and keyboard navigation (Escape to close menu)
 *   - Debounced resize handling for performance
 *
 * Conventions follow the Airbnb JavaScript style guide.
 */
(() => {
  'use strict';

  /** Toggle to silence debug logging in production. */
  const DEBUG = false;

  /**
   * Namespaced debug logger. No-op unless DEBUG is enabled.
   * @param {...*} args - Values to log.
   * @returns {void}
   */
  const log = (...args) => {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log('[CPS]', ...args);
    }
  };

  /**
   * Create a debounced version of a function that delays invocation until
   * `wait` ms have elapsed since the last call.
   * @param {Function} fn - Function to debounce.
   * @param {number} [wait=150] - Delay in milliseconds.
   * @returns {Function} Debounced wrapper.
   */
  const debounce = (fn, wait = 150) => {
    let timeoutId;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn(...args), wait);
    };
  };

  /** True when the user has requested reduced motion. */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  /**
   * Initialise scroll-triggered reveal animations using Intersection Observer.
   * Elements with `[data-aos]` are hidden on init (`.is-hidden`) and revealed
   * (`.is-visible`) as they enter the viewport. Falls back to showing all
   * content immediately when IntersectionObserver is unsupported or reduced
   * motion is preferred — content is never left permanently hidden.
   * @returns {void}
   */
  const initScrollReveals = () => {
    const revealTargets = document.querySelectorAll('[data-aos]');
    if (revealTargets.length === 0) {
      return;
    }

    // Feature detection: without IntersectionObserver, reveal everything now.
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      log(
        'IntersectionObserver unavailable or reduced motion — showing content.',
      );
      revealTargets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Hide only after confirming JS + observer support (progressive enhancement).
    revealTargets.forEach((el) => el.classList.add('is-hidden'));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const { target } = entry;
          target.classList.remove('is-hidden');
          target.classList.add('is-visible');
          obs.unobserve(target); // triggerOnce
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );

    revealTargets.forEach((el) => observer.observe(el));
    log(`Observing ${revealTargets.length} reveal target(s).`);
  };

  /**
   * Smoothly scroll to a same-page anchor target, respecting reduced-motion
   * preferences, and move keyboard focus to the destination for accessibility.
   * @param {string} hash - Target hash, e.g. "#features".
   * @returns {boolean} True when a matching target was found and scrolled to.
   */
  const scrollToHash = (hash) => {
    if (!hash || hash === '#') {
      return false;
    }

    let target;
    try {
      target = document.querySelector(hash);
    } catch (error) {
      // Malformed selector from a user-supplied hash — ignore gracefully.
      log('Invalid anchor selector:', hash, error);
      return false;
    }

    if (!target) {
      return false;
    }

    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    // Ensure the destination can receive focus without adding a visible outline
    // to non-interactive elements permanently.
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
    return true;
  };

  /**
   * Wire up smooth-scroll behaviour for in-page anchor links using event
   * delegation (a single listener on the document).
   * @returns {void}
   */
  const initSmoothScroll = () => {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) {
        return;
      }

      const hash = link.getAttribute('href');
      if (scrollToHash(hash)) {
        event.preventDefault();
        // Keep the URL in sync without an extra jump.
        window.history.replaceState(null, '', hash);
      }
    });
  };

  /**
   * Initialise the responsive navigation toggle. Manages `aria-expanded`,
   * the `hidden` attribute on the menu, outside-click dismissal, and Escape-key
   * handling for keyboard users.
   * @returns {void}
   */
  const initNavToggle = () => {
    const toggle = document.querySelector('[data-nav-toggle]');
    const menu = document.querySelector('[data-nav-menu]');
    if (!toggle || !menu) {
      return;
    }

    const desktopQuery = window.matchMedia('(min-width: 768px)');

    /**
     * Open or close the mobile menu and sync ARIA state.
     * @param {boolean} open - Whether the menu should be open.
     * @returns {void}
     */
    const setMenu = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
    };

    // Collapsed by default on small screens; CSS handles the desktop layout.
    const applyInitialState = () => {
      if (desktopQuery.matches) {
        menu.hidden = false;
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        setMenu(false);
      }
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenu(!isOpen);
      log('Nav toggled:', !isOpen);
    });

    // Close on Escape and return focus to the toggle.
    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        toggle.getAttribute('aria-expanded') === 'true' &&
        !desktopQuery.matches
      ) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Close when a navigation link is activated (mobile only).
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a') && !desktopQuery.matches) {
        setMenu(false);
      }
    });

    // Close when clicking outside the menu (mobile only).
    document.addEventListener('click', (event) => {
      if (desktopQuery.matches) {
        return;
      }
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (
        isOpen &&
        !menu.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        setMenu(false);
      }
    });

    // Re-evaluate layout state on resize (debounced for performance).
    window.addEventListener(
      'resize',
      debounce(applyInitialState, 150),
    );

    applyInitialState();
  };

  /**
   * Replace skeleton placeholders with their real content. Skeleton groups use
   * `[data-skeleton-group]`; the matching content uses `[data-content-group]`
   * with the same value and is revealed once the page is ready.
   * @returns {void}
   */
  const initSkeletonLoading = () => {
    const skeletons = document.querySelectorAll('[data-skeleton-group]');
    if (skeletons.length === 0) {
      return;
    }

    /**
     * Swap one skeleton group for its real content.
     * @param {Element} skeleton - The skeleton container element.
     * @returns {void}
     */
    const reveal = (skeleton) => {
      const groupId = skeleton.getAttribute('data-skeleton-group');
      const content = document.querySelector(
        `[data-content-group="${groupId}"]`,
      );
      skeleton.hidden = true;
      skeleton.setAttribute('aria-busy', 'false');
      if (content) {
        content.hidden = false;
      }
    };

    // Simulate async content readiness; in a real app this fires after fetch().
    // A short, fixed delay demonstrates the pattern without blocking the user.
    window.setTimeout(() => {
      skeletons.forEach(reveal);
      log(`Revealed ${skeletons.length} content group(s).`);
    }, 900);
  };

  /**
   * Bootstrap all interactive modules. Each initialiser is isolated in its own
   * try/catch so a single failure cannot break the rest of the page.
   * @returns {void}
   */
  const init = () => {
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
        // eslint-disable-next-line no-console
        console.error(`[CPS] Failed to initialise ${moduleInit.name}:`, error);
      }
    });

    log('Initialisation complete.');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
