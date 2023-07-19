// @ts-expect-error - no types
import { cv as _cv } from './assets/opencv'

export * from './assets/models'

export const cv = _cv as any
