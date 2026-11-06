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

export function registerMotion(name: string, definition: MotionDefinition): void {
  motionDefinitions.set(name, definition)
}

export function registerBehavior(name: string, behavior: MotionBehavior): void {
  behaviorDefinitions.set(name, behavior)
}

export function getMotionDefinition(name: string): MotionDefinition | undefined {
  return motionDefinitions.get(name)
}

export function getBehaviorDefinition(name: string): MotionBehavior | undefined {
  return behaviorDefinitions.get(name)
}
