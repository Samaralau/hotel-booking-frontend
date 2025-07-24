import type { Hotel } from '../../types/params'
import { Link } from 'wouter'
import StarUI from './StarRating'

interface Results {
  hotel: Hotel
  hotelprice?: number
  checkin?: string
  checkout?: string
  guests?: string
}

export const HotelCard = ({ hotel, hotelprice }: Results) => {
  return (
    <div className="card card-side bg-base-100 shadow-sm w-200 ">
      <figure className="p-4">
        <img
          src={`${hotel.image_details.prefix}0${hotel.image_details.suffix}`}
          alt={hotel.name}
          className="w-50 h-50 object-cover rounded"
        />
      </figure>
      <div className="card-body">
        <h2 className="text-xl font-semibold">{hotel.name}</h2>
        <p>{hotel.address}</p>
        <div>
          <StarUI
            rating={hotel.rating}
            name={`rating-${hotel.id}`}
            readonly={true}
          />
        </div>
        <div>
          <p className="text-green-600 font-semibold text-xl flex justify-end">
            $
            {hotelprice}
          </p>
        </div>
        <div className="flex justify-end">
          <Link
            href="/hotels/detail/atH8?destination_id=WD0M&checkin=2025-10-01&checkout=2025-10-07&lang=en_US&currency=SGD&country_code=SG&guests=2|2"
            className="btn btn-primary "
          >
            View Hotel Details
          </Link>
        </div>
      </div>
    </div>
  )
}
