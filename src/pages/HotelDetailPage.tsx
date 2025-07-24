import { useParams, Link } from 'wouter'
import useSWR from 'swr'
import { useSearchParams } from '../hooks/useSearchParams'
import { BookingDetails } from '../components/ui/BookingDetails'
import { RoomCard } from '../components/ui/RoomCard'
import type { PriceBaseResponse } from '../types/api'
import type { Room } from '../types/hotel'
import { BACKEND_URL } from '../config/api'
import { HotelInfo } from '../components/ui/HotelInfo'
import { NavBar } from '../components/layout/NavBar'

interface HotelPriceResponse extends PriceBaseResponse {
  rooms: Room[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export const HotelDetailPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const hotelId = params.hotel_id
  const destinationId = searchParams.destination_id

  // temporary
  const apiUrl
    = hotelId && destinationId
      ? `${BACKEND_URL}/hotels/${hotelId}/price?destination_id=${destinationId}&checkin=${searchParams.checkin}&checkout=${searchParams.checkout}&lang=${searchParams.lang}&currency=${searchParams.currency}&country_code=${searchParams.country_code}&guests=${searchParams.guests}`
      : null

  const { data, error, isLoading } = useSWR<HotelPriceResponse, Error>(
    apiUrl,
    fetcher,
    {
      refreshInterval: (data) => {
        // Revalidate every 5 seconds if search is not completed
        return data?.completed === true ? 0 : 5000
      },
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  )

  const groupedRooms
    = data?.rooms?.reduce(
      (groups, room) => {
        const roomType = room.type
        if (!groups[roomType]) {
          groups[roomType] = []
        }
        groups[roomType].push(room)
        return groups
      },
      {} as Record<string, Room[]>,
    ) || {}

  const pageTitle = `Hotel Details for ${hotelId}`
  return (
    <>
      <NavBar pageTitle={pageTitle} />

      {hotelId && <HotelInfo hotelId={hotelId} />}
      <BookingDetails
        searchParams={searchParams}
        destinationId={destinationId || undefined}
        hotelId={hotelId}
      />
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Room Options</h2>

        {!isLoading && !data?.completed && (
          <span>
            Please wait a moment as we fetch the best prices for you...
          </span>
        )}

        {error && (
          <div className="alert alert-error">
            <span>
              Error loading price data:
              {error.message}
            </span>
          </div>
        )}

        {data?.completed
          ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                {data.completed && (
                  <span className="text-lg text-base-content/70">
                    Last updated:
                    {' '}
                    {new Date().toLocaleString()}
                  </span>
                )}
              </div>

              {Object.keys(groupedRooms).length > 0
                ? (
                  <div className="space-y-4">
                    {Object.entries(groupedRooms).map(([roomType, rooms]) => (
                      <div key={roomType}>
                        <h3 className="text-lg font-semibold mb-4">
                          {rooms[0]?.roomNormalizedDescription
                            || `Room Type ${roomType}`}
                        </h3>
                        <div className="flex flex-col gap-4">
                          {rooms?.map(room => (
                            <RoomCard
                              key={room.key}
                              room={room}
                              currency={searchParams.currency || undefined}
                              hotelId={params.hotel_id}
                              destinationId={searchParams.destination_id}
                              checkin={searchParams.checkin}
                              checkout={searchParams.checkout}
                              guests={searchParams.guests}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
                : (
                  <p>No available rooms were found.</p>
                )}
            </>
          )
          : (
            <div className={isLoading ? 'mt-16' : 'mt-8'}>
              <div className="card card-side bg-base-100 shadow-sm">
                <figure className="p-10">
                  <div className="skeleton h-48 w-48 shrink-0 rounded-xl"></div>
                </figure>
                <div className="card-body py-12">
                  <div className="flex-1">
                    <div className="skeleton h-6 w-48"></div>
                    <div className="flex flex-wrap mt-4 gap-4">
                      <div className="skeleton h-6 w-20 rounded-full"></div>
                      <div className="skeleton h-6 w-20 rounded-full"></div>
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <div className="skeleton h-12 w-20 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
      <Link
        href={`/booking/${params.hotel_id}?destination_id=${searchParams.destination_id}&checkin=${searchParams.checkin}&checkout=${searchParams.checkout}&lang=${searchParams.lang}&currency=${searchParams.currency}&country_code=${searchParams.country_code}&guests=${searchParams.guests}`}
        className="btn btn-primary mr-4"
      >
        Book Now
      </Link>
      <Link
        href="/results/WD0M?checkin=2025-10-01&checkout=2025-10-07&lang=en_US&currency=SGD&country_code=SG&guests=2|2"
        className="btn btn-secondary mr-4"
      >
        Back to Results
      </Link>
      <Link href="/" className="btn btn-outline">
        Back to Home
      </Link>
    </>
  )
}
