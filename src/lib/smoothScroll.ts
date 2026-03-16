/**
 * Smoothly scrolls to an element.
 *
 * Uses the native `scrollIntoView({ behavior: "smooth" })` when the browser
 * supports the `scrollBehavior` CSS property (all modern browsers including
 * Chrome, Firefox, Edge, and iOS Safari ≥ 15.4).
 *
 * Falls back to a manual eased `requestAnimationFrame` loop on older browsers
 * (e.g. iOS Safari < 15.4) so scrolling is never instant-jump.
 */
export function smoothScrollTo(element: Element): void {
  if ("scrollBehavior" in document.documentElement.style) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  // Polyfill: manual eased scroll for browsers without scrollBehavior support
  const targetY =
    element.getBoundingClientRect().top + window.scrollY;
  const startY = window.scrollY;
  const distance = targetY - startY;
  // Duration scales with distance but is capped at 800 ms to avoid sluggishness.
  // The factor 0.5 maps ~1000 px of scroll distance to ~500 ms, which feels
  // natural on most screens without being too slow for short hops.
  const SCROLL_SPEED_FACTOR = 0.5;
  const duration = Math.min(Math.abs(distance) * SCROLL_SPEED_FACTOR, 800);
  let startTime: number | null = null;

  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(timestamp: number): void {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
