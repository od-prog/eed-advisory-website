export type RevealDirection = 'up' | 'down' | 'left' | 'right'

// CSS custom properties are the runtime source for duration, stagger, and distance.
// These fallback values cover cases where the stylesheet is not available; delay
// and ease intentionally remain component-independent defaults.
const fallbackDefaults = {
  durationMs: 650,
  delayMs: 0,
  staggerMs: 80,
  distancePx: 24,
  ease: 'power3.out',
} as const

export type MotionOptions = {
  durationMs: number
  delayMs: number
  staggerMs: number
  distancePx: number
  direction: RevealDirection
  ease: string
}

function readNumber(value: string | undefined, fallback: number): number {
  if (value === undefined) {
    return fallback
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function readToken(element: HTMLElement, token: string, fallback: number): number {
  const value = getComputedStyle(element).getPropertyValue(token).trim()
  const match = /^(\d+(?:\.\d+)?)(ms|s|px)?$/.exec(value)
  if (!match) return fallback
  const amount = Number(match[1])
  const unit = match[2]
  return unit === 's' ? amount * 1000 : amount
}

function readDirection(value: string | undefined): RevealDirection {
  if (value === 'up' || value === 'down' || value === 'left' || value === 'right') {
    return value
  }
  return 'up'
}

export function readMotionOptions(element: HTMLElement): MotionOptions {
  const durationDefault = readToken(element, '--motion-duration-slow', fallbackDefaults.durationMs)
  const staggerDefault = readToken(element, '--motion-stagger', fallbackDefaults.staggerMs)
  const distanceDefault = readToken(element, '--motion-distance', fallbackDefaults.distancePx)
  return {
    durationMs: readNumber(element.dataset.motionDuration, durationDefault),
    delayMs: readNumber(element.dataset.motionDelay, fallbackDefaults.delayMs),
    staggerMs: readNumber(element.dataset.motionStagger, staggerDefault),
    distancePx: readNumber(element.dataset.motionDistance, distanceDefault),
    direction: readDirection(element.dataset.motionDirection),
    ease: fallbackDefaults.ease,
  }
}

export function offsetFor(direction: RevealDirection, distance: number): { x: number; y: number } {
  switch (direction) {
    case 'down':
      return { x: 0, y: -distance }
    case 'left':
      return { x: distance, y: 0 }
    case 'right':
      return { x: -distance, y: 0 }
    default:
      return { x: 0, y: distance }
  }
}
