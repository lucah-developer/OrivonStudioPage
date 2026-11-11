// Shared, allocation-free state between the scroll timeline (Pillars.jsx) and the WebGL
// installation (CosmicSequence.js). The scroll side writes, the render loop reads.
export const pillarsState = {
  // 0..1 across the four disciplines (0-25% teal, 25-50% orange, 50-75% violet, 75-100% blue).
  tour: 0,
  // 0..1 while the installation pulls back and dims before the section releases.
  exit: 0,
};

// Continuous focus 0..3: each pillar holds the centre of its quarter, cross-fading at the borders.
export function focusOfTour(tour) {
  return Math.max(0, Math.min(3, tour * 4 - 0.5));
}

// Eases the raw focus so each discipline holds steady and only changes inside [from, to] of the
// hand-over between two neighbours (e.g. 0.2..0.8). Returns { from, to, mix } with mix in 0..1.
export function handOver(focus, from = 0.3, to = 0.7) {
  const a = Math.min(2, Math.floor(focus));
  const f = focus - a;
  const x = Math.max(0, Math.min(1, (f - from) / (to - from)));
  return { from: a, to: a + 1, mix: x * x * (3 - 2 * x) };
}
