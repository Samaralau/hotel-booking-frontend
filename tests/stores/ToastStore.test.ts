import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import useToastStore from '../../src/stores/ToastStore'

describe('ToastStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialise with default values', () => {
    const { result } = renderHook(() => useToastStore())

    expect(result.current.toastMsg).toBe('')
    expect(result.current.toastType).toBe('info')
    expect(result.current.toastTimeoutId).toBeNull()
  })

  it('should set toast with default type', () => {
    const { result } = renderHook(() => useToastStore())

    act(() => {
      result.current.setToast('Test message')
    })

    expect(result.current.toastMsg).toBe('Test message')
    expect(result.current.toastType).toBe('info')
    expect(result.current.toastTimeoutId).not.toBeNull()
  })

  it('should set toast with custom type', () => {
    const { result } = renderHook(() => useToastStore())

    act(() => {
      result.current.setToast('Success message', 'success')
    })

    expect(result.current.toastMsg).toBe('Success message')
    expect(result.current.toastType).toBe('success')
    expect(result.current.toastTimeoutId).not.toBeNull()
  })

  it('should clear toast manually', () => {
    const { result } = renderHook(() => useToastStore())

    // Set a toast first
    act(() => {
      result.current.setToast('Test message', 'success')
    })

    expect(result.current.toastMsg).toBe('Test message')
    expect(result.current.toastTimeoutId).not.toBeNull()

    // Clear the toast
    act(() => {
      result.current.clearToast()
    })

    expect(result.current.toastMsg).toBe('')
    expect(result.current.toastType).toBe('info')
    expect(result.current.toastTimeoutId).toBeNull()
  })

  it('should auto-clear toast after 3 seconds', () => {
    const { result } = renderHook(() => useToastStore())

    act(() => {
      result.current.setToast('Auto-clear message')
    })

    expect(result.current.toastMsg).toBe('Auto-clear message')
    expect(result.current.toastTimeoutId).not.toBeNull()

    // Fast-forward time by 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.toastMsg).toBe('')
    expect(result.current.toastType).toBe('info')
    expect(result.current.toastTimeoutId).toBeNull()
  })

  it('should clear previous timeout when setting new toast', () => {
    const { result } = renderHook(() => useToastStore())

    // Set first toast
    act(() => {
      result.current.setToast('First message')
    })

    const firstTimeoutId = result.current.toastTimeoutId

    // Set second toast before first one expires
    act(() => {
      result.current.setToast('Second message')
    })

    // Should have a new timeout ID (previous was cleared)
    expect(result.current.toastMsg).toBe('Second message')
    expect(result.current.toastTimeoutId).not.toBe(firstTimeoutId)
    expect(result.current.toastTimeoutId).not.toBeNull()
  })

  it('should handle multiple toast updates in rapid succession', () => {
    const { result } = renderHook(() => useToastStore())

    // Rapidly set multiple toasts
    act(() => {
      result.current.setToast('Message 1')
      result.current.setToast('Message 2')
      result.current.setToast('Message 3', 'error')
    })

    // Should only show the last message
    expect(result.current.toastMsg).toBe('Message 3')
    expect(result.current.toastType).toBe('error')

    // Fast-forward 3 seconds to ensure auto-clear still works
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.toastMsg).toBe('')
    expect(result.current.toastType).toBe('info')
  })

  it('should not crash when clearing toast with no active timeout', () => {
    const { result } = renderHook(() => useToastStore())

    // Clear toast without setting one first
    expect(() => {
      act(() => {
        result.current.clearToast()
      })
    }).not.toThrow()

    expect(result.current.toastMsg).toBe('')
    expect(result.current.toastType).toBe('info')
    expect(result.current.toastTimeoutId).toBeNull()
  })
})
