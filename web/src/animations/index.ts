import './lifecycle'

export { prefersReducedMotion } from './preferences'
export {
  getBehaviorDefinition,
  getMotionDefinition,
  registerBehavior,
  registerMotion,
} from './registry'
export type { MotionBehavior, MotionContext, MotionDefinition } from './registry'
