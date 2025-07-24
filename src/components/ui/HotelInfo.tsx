import useSWR from 'swr'
import { BACKEND_URL } from '../../config/api'
import type { Hotel } from '../../types/hotel'
import { MapView } from './MapView'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface HotelInfoProps {
  hotelId: string
}

export const HotelInfo = ({ hotelId }: HotelInfoProps) => {
  const apiUrl = `${BACKEND_URL}/hotels/${hotelId}`

  const { data, error, isLoading } = useSWR<Hotel, Error>(apiUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  if (isLoading) {
    return (
      <div className="mb-6">
        <span className="loading loading-ball loading-xs"></span>
        <span className="loading loading-ball loading-sm"></span>
        <span className="loading loading-ball loading-md"></span>
        <span className="loading loading-ball loading-lg"></span>
        <span className="loading loading-ball loading-xl"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error mb-6">
        <span>
          Error loading hotel details:
          {error.message}
        </span>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="mb-6">
      <h2 className="card-title text-2xl mb-4">{data.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-semibold text-base-content/70 mb-2">
            Location
          </p>
          <MapView lat={data.latitude} lng={data.longitude} />
          <p className="mt-2">{data.address}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-base-content/70">Rating</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{data.rating}</span>
            <span className="text-base-content/70">stars</span>
          </div>
        </div>
      </div>

      <div
        tabIndex={0}
        className="collapse collapse-plus bg-base-100 border-base-300 border"
      >
        <div className="collapse-title font-semibold">
          View Hotel Description
        </div>
        <div
          className="collapse-content text-sm"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
      </div>
    </div>
  )
}
