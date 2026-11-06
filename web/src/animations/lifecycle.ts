import { prefersReducedMotion } from './preferences'
import type { MotionContext } from './registry'
import { getBehaviorDefinition, getMotionDefinition } from './registry'
import './reveal'
import './text'

interface BeforeSwapEvent extends Event {
  newDocument: Document
}

function isBeforeSwapEvent(event: Event): event is BeforeSwapEvent {
  return 'newDocument' in event
}

const pageTweens: gsap.core.Tween[] = []
const pageObservers: IntersectionObserver[] = []
const pageCleanups: Array<() => void> = []

const motionContext: MotionContext = {
  instant: false,
  registerTween: (tween) => {
    pageTweens.push(tween)
  },
}

function teardown(): void {
  for (const tween of pageTweens.splice(0)) {
    tween.kill()
  }
  for (const observer of pageObservers.splice(0)) {
    observer.disconnect()
  }
  for (const cleanup of pageCleanups.splice(0)) {
    cleanup()
  }
}

function instantFinish(element: HTMLElement): void {
  const definition = getMotionDefinition(element.dataset.motion ?? '')
  if (!definition) {
    element.dataset.motionState = 'done'
    return
  }
  definition.init(element, { ...motionContext, instant: true })
  element.dataset.motionState = 'done'
}

function animateIn(element: HTMLElement): void {
  if (element.dataset.motionState !== undefined) {
    return
  }
  element.dataset.motionState = 'active'

  const definition = getMotionDefinition(element.dataset.motion ?? '')
  if (!definition) {
    element.dataset.motionState = 'done'
    return
  }
  definition.init(element, motionContext)
}

function setupBehaviors(): void {
  for (const element of document.querySelectorAll<HTMLElement>('[data-behavior]')) {
    const behavior = getBehaviorDefinition(element.dataset.behavior ?? '')
    if (behavior) {
      const cleanup = behavior(element)
      if (cleanup) {
        pageCleanups.push(cleanup)
      }
    }
  }
}

function setupMotion(): void {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-motion]')).filter(
    (element) => element.dataset.motionState === undefined,
  )

  if (prefersReducedMotion()) {
    for (const element of elements) {
      instantFinish(element)
    }
    setupBehaviors()
    return
  }

  if (elements.length > 0) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue
          }
          observerInstance.unobserve(entry.target)
          if (entry.target instanceof HTMLElement) {
            animateIn(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    pageObservers.push(observer)
    for (const element of elements) {
      observer.observe(element)
    }
  }

  setupBehaviors()
}

let animationModuleInitialised = false

export function initialiseMotionLifecycle(): void {
  if (animationModuleInitialised) {
    return
  }
  animationModuleInitialised = true

  document.addEventListener('astro:page-load', setupMotion)

  document.addEventListener('astro:before-swap', (event) => {
    if (isBeforeSwapEvent(event) && event.newDocument.documentElement) {
      event.newDocument.documentElement.classList.add('motion-js')
    }
    teardown()
  })
}

initialiseMotionLifecycle()
