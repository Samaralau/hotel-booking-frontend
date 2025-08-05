import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js/pure'
import CheckoutForm from '../src/pages/BookingPage'

// Mockup for stripe components
vi.mock('@stripe/react-stripe-js', async () => {
  const actual = await vi.importActual<any>('@stripe/react-stripe-js')
  return {
    ...actual,
    useStripe: () => ({ confirmCardPayment: vi.fn().mockResolvedValue({ paymentIntent: { status: 'succeeded' } }) }),
    useElements: () => ({ getElement: () => ({}) }),
    CardElement: () => <input data-testid="card-element" />,
  }
})

const stripePromise = loadStripe('pk_test_mocked')

// Test group
describe('CheckoutForm', () => {
  const originalAlert = window.alert

  beforeEach(() => {
    window.alert = vi.fn()
    global.fetch = vi.fn().mockResolvedValue({ ok: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    window.alert = originalAlert
  })

  // Test 1
  test('Submits valid form successfully', async () => {
    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>,
    )

    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Tan' },
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
      target: { value: '91234567' },
    })
    fireEvent.change(screen.getByPlaceholderText('Billing Address'), {
      target: { value: '123 Test Avenue' },
    })

    const submitButton = screen.getByText('Submit Booking')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/bookings', expect.anything())
      expect(window.alert).toHaveBeenCalledWith('Booking submitted successfully!')
    })
  })

  // Test 2
  test('Shows error messages for invalid inputs', () => {
    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>,
    )

    fireEvent.click(screen.getByText('Submit Booking'))

    expect(screen.getByText('First name is required')).toBeInTheDocument()
    expect(screen.getByText('Last name is required')).toBeInTheDocument()
    expect(screen.getByText('Invalid email format')).toBeInTheDocument()
    expect(screen.getByText('Phone must be 8 digits')).toBeInTheDocument()
    expect(screen.getByText('Billing address is required')).toBeInTheDocument()
  })

  // Test 3
  test('Payment failed', async () => {
    // Mock a failed fetch response
    global.fetch = vi.fn().mockResolvedValue({ ok: false })
    window.alert = vi.fn()

    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>,
    )

    // Fill with valid form data
    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Tan' },
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
      target: { value: '91234567' },
    })
    fireEvent.change(screen.getByPlaceholderText('Billing Address'), {
      target: { value: '123 Test Avenue' },
    })

    fireEvent.click(screen.getByText('Submit Booking'))

    // Wait for the error alert to appear
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/bookings', expect.anything())
      expect(window.alert).toHaveBeenCalledWith('Booking failed')
    })
  })
})
