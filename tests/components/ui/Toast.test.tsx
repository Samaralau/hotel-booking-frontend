import { render, screen, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Toast } from '../../../src/components/ui/Toast'
import useToastStore from '../../../src/stores/ToastStore'

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should not render when toastMsg is empty', () => {
    const { container } = render(<Toast />)

    expect(container.firstChild).toBeNull()
  })

  it('should render toast with info type by default', () => {
    // Set toast in the store
    act(() => {
      useToastStore.getState().setToast('Test info message')
    })

    render(<Toast />)

    const toast = screen.getByText('Test info message')
    expect(toast).toBeInTheDocument()
    expect(toast).toHaveClass('alert-info')
    expect(toast).toHaveClass(
      'fixed',
      'top-4',
      'right-4',
      'alert',
      'text-white',
      'px-4',
      'py-2',
      'rounded',
      'shadow-lg',
      'z-50',
      'transition-opacity',
      'duration-300',
    )
  })

  it('should render toast with success type', () => {
    act(() => {
      useToastStore.getState().setToast('Success message', 'success')
    })

    render(<Toast />)

    const toast = screen.getByText('Success message')
    expect(toast).toBeInTheDocument()
    expect(toast).toHaveClass('alert-success')
  })

  it('should render toast with error type', () => {
    act(() => {
      useToastStore.getState().setToast('Error message', 'error')
    })

    render(<Toast />)

    const toast = screen.getByText('Error message')
    expect(toast).toBeInTheDocument()
    expect(toast).toHaveClass('alert-error')
  })

  it('should disappear when toast is cleared from store', () => {
    // Set initial toast
    act(() => {
      useToastStore.getState().setToast('Message to be cleared')
    })

    render(<Toast />)

    expect(screen.getByText('Message to be cleared')).toBeInTheDocument()

    // Clear the toast
    act(() => {
      useToastStore.getState().clearToast()
    })

    expect(screen.queryByText('Message to be cleared')).not.toBeInTheDocument()
  })

  it('should update when toast message changes', () => {
    // Set initial toast
    act(() => {
      useToastStore.getState().setToast('First message', 'info')
    })

    const { rerender } = render(<Toast />)

    expect(screen.getByText('First message')).toBeInTheDocument()
    expect(screen.getByText('First message')).toHaveClass('alert-info')

    // Update the toast
    act(() => {
      useToastStore.getState().setToast('Second message', 'error')
    })

    rerender(<Toast />)

    expect(screen.queryByText('First message')).not.toBeInTheDocument()
    expect(screen.getByText('Second message')).toBeInTheDocument()
    expect(screen.getByText('Second message')).toHaveClass('alert-error')
  })

  it('should auto-disappear after 3 seconds', () => {
    act(() => {
      useToastStore.getState().setToast('Auto-clear message')
    })

    render(<Toast />)

    expect(screen.getByText('Auto-clear message')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.queryByText('Auto-clear message')).not.toBeInTheDocument()
  })

  it('should handle rapid toast updates', () => {
    render(<Toast />)

    // Rapidly set multiple toasts
    act(() => {
      useToastStore.getState().setToast('Message 1', 'info')
      useToastStore.getState().setToast('Message 2', 'success')
      useToastStore.getState().setToast('Message 3', 'error')
    })

    // Should only show the last message
    expect(screen.queryByText('Message 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Message 2')).not.toBeInTheDocument()
    expect(screen.getByText('Message 3')).toBeInTheDocument()
    expect(screen.getByText('Message 3')).toHaveClass('alert-error')
  })

  it('should maintain correct styling across different toast types', () => {
    const { rerender } = render(<Toast />)

    // Test info toast
    act(() => {
      useToastStore.getState().setToast('Info message', 'info')
    })
    rerender(<Toast />)

    let toast = screen.getByText('Info message')
    expect(toast).toHaveClass('alert-info')

    // Test success toast
    act(() => {
      useToastStore.getState().setToast('Success message', 'success')
    })
    rerender(<Toast />)

    toast = screen.getByText('Success message')
    expect(toast).toHaveClass('alert-success')
    expect(toast).not.toHaveClass('alert-info')

    // Test error toast
    act(() => {
      useToastStore.getState().setToast('Error message', 'error')
    })
    rerender(<Toast />)

    toast = screen.getByText('Error message')
    expect(toast).toHaveClass('alert-error')
    expect(toast).not.toHaveClass('alert-success')
    expect(toast).not.toHaveClass('alert-info')
  })
})
