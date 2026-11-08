export type RevealDirection = 'up' | 'down' | 'left' | 'right'

export const motionDefaults = {
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

function readDirection(value: string | undefined): RevealDirection {
  if (value === 'up' || value === 'down' || value === 'left' || value === 'right') {
    return value
  }
  return 'up'
}

export function readMotionOptions(element: HTMLElement): MotionOptions {
  return {
    durationMs: readNumber(element.dataset.motionDuration, motionDefaults.durationMs),
    delayMs: readNumber(element.dataset.motionDelay, motionDefaults.delayMs),
    staggerMs: readNumber(element.dataset.motionStagger, motionDefaults.staggerMs),
    distancePx: readNumber(element.dataset.motionDistance, motionDefaults.distancePx),
    direction: readDirection(element.dataset.motionDirection),
    ease: motionDefaults.ease,
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
