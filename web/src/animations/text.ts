import { gsap } from 'gsap'
import { readMotionOptions } from './motionOptions'
import type { MotionContext } from './registry'
import { registerMotion } from './registry'

function seconds(value: number): number {
  return value / 1000
}

export function initTextReveal(element: HTMLElement, context: MotionContext): void {
  const options = readMotionOptions(element)
  const words = Array.from(element.querySelectorAll<HTMLElement>('.motion-word'))

  element.dataset.motionState = 'active'

  if (words.length === 0) {
    element.dataset.motionState = 'done'
    return
  }

  if (context.instant) {
    gsap.set(words, { x: 0, y: 0, opacity: 1 })
    element.dataset.motionState = 'done'
    return
  }

  gsap.set(words, { y: '0.6em', opacity: 0 })

  const tween = gsap.to(words, {
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

registerMotion('text-reveal', { init: initTextReveal })
