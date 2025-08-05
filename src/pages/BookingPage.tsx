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
import { NavBar } from '../components/layout/NavBar'
import useRoomBookingStore from '../stores/RoomBookingStore'

const stripePromise = loadStripe(
  'pk_test_51RkOjuPSc0OCzrEzBwXXxxQaYDDeAQf66TRqSPK8zi8AuZDKUPyQrG3MRjTDPNXXHph6vbnzG8GOwkqZllAx7GcJ00KEWTx5jG',
) // Replace with Stripe publishable key

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

  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setErrorMessages((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })

    const newErrors: { [key: string]: string } = {}

    if (name === 'firstName' && !value.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (name === 'lastName' && !value.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      newErrors.email = 'Invalid email format'
    }
    if (name === 'phone' && !/^\d{8}$/.test(value)) {
      newErrors.phone = 'Phone must be 8 digits'
    }
    if (name === 'billingAddress' && !value.trim()) {
      newErrors.billingAddress = 'Billing address is required'
    }

    setErrorMessages(prev => ({ ...prev, ...newErrors }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { [key: string]: string } = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!/^\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 8 digits'
    }
    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrorMessages(newErrors)
      return
    }

    if (!stripe || !elements) return

    console.log('Submitting booking with:', formData)

    // Placeholder for api, to be updated
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Guest Information</h2>

      <div className="flex gap-4">
        <div className="w-full">
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input input-bordered w-full"
          />
          {errorMessages.firstName && <p className="text-red-500 text-sm mt-1">{errorMessages.firstName}</p>}
        </div>

        <div className="w-full">
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input input-bordered w-full"
          />
          {errorMessages.lastName && <p className="text-red-500 text-sm mt-1">{errorMessages.lastName}</p>}
        </div>
      </div>

      <div>
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input input-bordered w-full"
        />
        {errorMessages.email && <p className="text-red-500 text-sm mt-1">{errorMessages.email}</p>}
      </div>

      <div>
        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input input-bordered w-full"
        />
        {errorMessages.phone && <p className="text-red-500 text-sm mt-1">{errorMessages.phone}</p>}
      </div>

      <textarea
        name="specialRequests"
        placeholder="Special Requests"
        value={formData.specialRequests}
        onChange={handleChange}
        className="textarea textarea-bordered w-full"
      />

      <div>
        <input
          name="billingAddress"
          placeholder="Billing Address"
          value={formData.billingAddress}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input input-bordered w-full"
        />
        {errorMessages.billingAddress && <p className="text-red-500 text-sm mt-1">{errorMessages.billingAddress}</p>}
      </div>

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

  const roomBookingStore = useRoomBookingStore()
  console.log('Selected Rooms:', roomBookingStore.selectedRooms)
  console.log('Total Price:', roomBookingStore.getTotalPrice())
  console.log('Max Selected Rooms:', roomBookingStore.maxSelectedRooms)
  console.log('Hotel ID:', roomBookingStore.hotelId)
  console.log('Check-in:', roomBookingStore.checkin)
  console.log('Check-out:', roomBookingStore.checkout)
  console.log('Guests:', roomBookingStore.guests)

  useEffect(() => {
    console.log('Booking for hotel:', params.hotel_id)
  }, [searchParams])

  const pageTitle = `Complete Your Booking`

  return (
    <>
      <NavBar pageTitle={pageTitle} />
      <Elements stripe={stripePromise}>
        <div className="p-6">
          {/* <h1 className="text-3xl font-bold mb-4">Complete Your Booking</h1> */}
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
    </>
  )
}

export default CheckoutForm
