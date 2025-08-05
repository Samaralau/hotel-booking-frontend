import { describe, it, expect } from 'vitest'
import { getToastStyles } from '../../src/utils/ToastStyles'

describe('getToastStyles', () => {
  it('should return correct class for error type', () => {
    expect(getToastStyles('error')).toBe('alert-error')
  })

  it('should return correct class for success type', () => {
    expect(getToastStyles('success')).toBe('alert-success')
  })

  it('should return correct class for info type', () => {
    expect(getToastStyles('info')).toBe('alert-info')
  })

  it('should default to info class for unknown type', () => {
    expect(getToastStyles('unknown')).toBe('alert-info')
    expect(getToastStyles('')).toBe('alert-info')
    expect(getToastStyles('random')).toBe('alert-info')
  })
})
