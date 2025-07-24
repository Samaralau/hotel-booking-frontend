import { useEffect, useState } from 'react'
import { useParams } from 'wouter'
import { useSearchParams } from '../hooks/useSearchParams'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe('pk_test_51RkOjuPSc0OCzrEzBwXXxxQaYDDeAQf66TRqSPK8zi8AuZDKUPyQrG3MRjTDPNXXHph6vbnzG8GOwkqZllAx7GcJ00KEWTx5jG') // Replace with Stripe publishable key

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    billingAddress: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    // Can also use elements.getElement(CardElement) to extract card info
    // But since no real payment, just simulate
    console.log('Submitting booking with:', formData)

    // Simulated API call
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        cardInfo: '[collected via Stripe]',
      }),
    })

    if (res.ok) {
      alert('Booking submitted successfully!')
    }
    else {
      alert('Booking failed')
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e).catch((err) => {
      console.error('Error submitting form:', err)
    })
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Guest Information</h2>

      <div className="flex gap-4">
        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />
        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />
      </div>

      <input
        name="email"
        placeholder="Email"
        type="email"
        onChange={handleChange}
        required
        className="input input-bordered w-full"
      />
      <input
        name="phone"
        placeholder="Phone Number"
        onChange={handleChange}
        required
        className="input input-bordered w-full"
      />
      <textarea
        name="specialRequests"
        placeholder="Special Requests"
        onChange={handleChange}
        className="textarea textarea-bordered w-full"
      />
      <input
        name="billingAddress"
        placeholder="Billing Address"
        onChange={handleChange}
        required
        className="input input-bordered w-full"
      />

      <h2 className="text-2xl font-bold mt-6">Payment Information</h2>
      <CardElement
        options={{ style: { base: { fontSize: '16px' } } }}
        className="p-2 border rounded-md"
      />

      <button type="submit" className="btn btn-primary mt-4 w-full">
        Submit Booking
      </button>
    </form>
  )
}

export const BookingPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log('Booking for hotel:', params.hotel_id)
  }, [searchParams])

  return (
    <Elements stripe={stripePromise}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Complete Your Booking</h1>
        <p className="mb-6">
          Hotel ID:
          {' '}
          <strong>{params.hotel_id}</strong>
          <br />
          Destination ID:
          {' '}
          <strong>{searchParams.destination_id}</strong>
          <br />
          Check-in:
          {' '}
          <strong>{searchParams.checkin}</strong>
          <br />
          Check-out:
          {' '}
          <strong>{searchParams.checkout}</strong>
          <br />
        </p>

        <CheckoutForm />
      </div>
    </Elements>
  )
}
