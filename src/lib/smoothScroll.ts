/**
 * Smoothly scrolls to an element, accounting for a sticky header offset.
 *
 * Uses native `scrollIntoView` when the browser supports `scrollBehavior`
 * (all modern browsers including Chrome, Firefox, Edge, and iOS Safari ≥ 15.4).
 *
 * Falls back to a manual eased `requestAnimationFrame` loop on older browsers
 * so scrolling is never an instant jump.
 *
 * @param element - The target DOM element to scroll to.
 * @param headerOffset - Height in px of any sticky header to offset by. Default 80.
 */
export function smoothScrollTo(element: Element, headerOffset = 80): void {
  const targetY =
    element.getBoundingClientRect().top + window.scrollY - headerOffset;

  if ("scrollBehavior" in document.documentElement.style) {
    window.scrollTo({ top: targetY, behavior: "smooth" });
    return;
  }

  // Polyfill: manual eased scroll for browsers without scrollBehavior support
  const startY = window.scrollY;
  const distance = targetY - startY;

  // Guard: if already at target, do nothing (avoids divide-by-zero in duration calc)
  if (distance === 0) return;

  // Duration scales with distance but is capped at 800 ms to avoid sluggishness.
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
