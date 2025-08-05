import { type SearchParams } from '../../types/params'

interface BookingDetailsProps {
  searchParams: SearchParams
  destinationId?: string
  hotelId?: string
}

export const BookingDetails = ({ searchParams, destinationId, hotelId }: BookingDetailsProps) => {
  return (
    <div className="mb-4">
      {destinationId && (
        <p>
          <strong>Destination:</strong>
          {' '}
          {destinationId}
        </p>
      )}
      {hotelId && (
        <p>
          <strong>Hotel:</strong>
          {' '}
          {hotelId}
        </p>
      )}
      <p>
        <strong>Check-in:</strong>
        {' '}
        {searchParams.checkin}
      </p>
      <p>
        <strong>Check-out:</strong>
        {' '}
        {searchParams.checkout}
      </p>
      <p>
        <strong>Language:</strong>
        {' '}
        {searchParams.lang}
      </p>
      <p>
        <strong>Currency:</strong>
        {' '}
        {searchParams.currency}
      </p>
      <p>
        <strong>Country:</strong>
        {' '}
        {searchParams.country_code}
      </p>
      <p>
        <strong>Guests:</strong>
        {' '}
        {searchParams.guests}
      </p>
    </div>
  )
}
