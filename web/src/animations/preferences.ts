const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return true
  }
  return window.matchMedia(reducedMotionQuery).matches
}
