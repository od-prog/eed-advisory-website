export type MotionContext = {
  instant: boolean
  registerTween: (tween: gsap.core.Tween) => void
}

export type MotionDefinition = {
  init: (element: HTMLElement, context: MotionContext) => void
}

export type MotionBehavior = (element: HTMLElement) => () => void

const motionDefinitions = new Map<string, MotionDefinition>()
const behaviorDefinitions = new Map<string, MotionBehavior>()
const registrationListeners = new Set<() => void>()

export function onRegistration(listener: () => void): () => void {
  registrationListeners.add(listener)
  return () => registrationListeners.delete(listener)
}

function notifyRegistration(): void {
  for (const listener of registrationListeners) listener()
}

export function registerMotion(name: string, definition: MotionDefinition): void {
  motionDefinitions.set(name, definition)
  notifyRegistration()
}

export function registerBehavior(name: string, behavior: MotionBehavior): void {
  behaviorDefinitions.set(name, behavior)
  notifyRegistration()
}

export function getMotionDefinition(name: string): MotionDefinition | undefined {
  return motionDefinitions.get(name)
}

export function getBehaviorDefinition(name: string): MotionBehavior | undefined {
  return behaviorDefinitions.get(name)
}
