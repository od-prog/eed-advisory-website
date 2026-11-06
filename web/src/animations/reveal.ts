import { gsap } from 'gsap'
import { offsetFor, readMotionOptions } from './motionOptions'
import type { MotionContext } from './registry'
import { registerMotion } from './registry'

function seconds(value: number): number {
  return value / 1000
}

function finishInstantly(targets: gsap.TweenTarget): void {
  gsap.set(targets, { x: 0, y: 0, opacity: 1 })
}

export function initReveal(element: HTMLElement, context: MotionContext): void {
  const options = readMotionOptions(element)

  element.dataset.motionState = 'active'

  if (context.instant) {
    finishInstantly(element)
    element.dataset.motionState = 'done'
    return
  }

  const offset = offsetFor(options.direction, options.distancePx)
  gsap.set(element, { x: offset.x, y: offset.y, opacity: 0 })

  const tween = gsap.to(element, {
    x: 0,
    y: 0,
    opacity: 1,
    duration: seconds(options.durationMs),
    delay: seconds(options.delayMs),
    ease: options.ease,
    overwrite: 'auto',
    onComplete: () => {
      element.dataset.motionState = 'done'
    },
  })

  context.registerTween(tween)
}

export function initStagger(element: HTMLElement, context: MotionContext): void {
  const options = readMotionOptions(element)
  const targets = Array.from(element.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  )

  element.dataset.motionState = 'active'

  if (targets.length === 0) {
    element.dataset.motionState = 'done'
    return
  }

  if (context.instant) {
    finishInstantly(targets)
    element.dataset.motionState = 'done'
    return
  }

  gsap.set(targets, { y: options.distancePx, opacity: 0 })

  const tween = gsap.to(targets, {
    y: 0,
    opacity: 1,
    duration: seconds(options.durationMs),
    delay: seconds(options.delayMs),
    stagger: seconds(options.staggerMs),
    ease: options.ease,
    overwrite: 'auto',
    onComplete: () => {
      element.dataset.motionState = 'done'
    },
  })

  context.registerTween(tween)
}

registerMotion('reveal', { init: initReveal })
registerMotion('stagger', { init: initStagger })
