import { useParams, Link, useLocation } from 'wouter'
import useSWR from 'swr'
import { useEffect } from 'react'
import { useSearchParams } from '../hooks/useSearchParams'
import { RoomCard } from '../components/ui/RoomCard'
import type { PriceBaseResponse } from '../types/api'
import type { Room } from '../types/hotel'
import { BACKEND_URL } from '../config/api'
import { HotelInfo } from '../components/ui/HotelInfo'
import { NavBar } from '../components/layout/NavBar'
import useRoomBookingStore from '../stores/RoomBookingStore'
import useAuthStore from '../stores/AuthStore'

interface HotelPriceResponse extends PriceBaseResponse {
  rooms: Room[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export const HotelDetailPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const [, navigate] = useLocation()
  const hotelId = params.hotel_id
  const destinationId = searchParams.destination_id
  const guests = searchParams.guests
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  // Room booking store
  const selectedRooms = useRoomBookingStore(state => state.selectedRooms)
  const setRoomBookingData = useRoomBookingStore(
    state => state.setRoomBookingData,
  )
  const setMaxSelectedRooms = useRoomBookingStore(
    state => state.setMaxSelectedRooms,
  )
  const clearRoomBookingData = useRoomBookingStore(
    state => state.clearRoomBookingData,
  )
  const getTotalPrice = useRoomBookingStore(state => state.getTotalPrice)

  // Parse guests parameter to extract number of rooms
  const parseGuestsParam = (
    guestsParam: string | null,
  ): { people: number, rooms: number } => {
    // default on Travel with OCBC
    if (!guestsParam) return { people: 2, rooms: 1 }

    const parts = guestsParam.split('|')
    const rooms = parts.length
    // guests PER room
    const totalPeople = parts.reduce(
      (sum, guests) => sum + parseInt(guests),
      0,
    )

    return { people: totalPeople, rooms }
  }

  const { rooms: maxRooms } = parseGuestsParam(guests)

  // Set up room booking data when component mounts
  useEffect(() => {
    if (hotelId && searchParams.checkin && searchParams.checkout && guests) {
      setRoomBookingData({
        hotelId,
        checkin: searchParams.checkin,
        checkout: searchParams.checkout,
        guests,
      })
      setMaxSelectedRooms(maxRooms)
    }

    // Clear booking data when component unmounts
    return () => {
      clearRoomBookingData()
    }
  }, [
    hotelId,
    searchParams.checkin,
    searchParams.checkout,
    guests,
    maxRooms,
    setRoomBookingData,
    setMaxSelectedRooms,
    clearRoomBookingData,
  ])

  // API URL for fetching hotel prices
  const apiUrl
    = hotelId && destinationId
      ? `${BACKEND_URL}/hotels/${hotelId}/price?destination_id=${destinationId}&checkin=${searchParams.checkin}&checkout=${searchParams.checkout}&lang=${searchParams.lang}&currency=${searchParams.currency}&country_code=${searchParams.country_code}&guests=${searchParams.guests}`
      : null

  const { data, error, isLoading } = useSWR<HotelPriceResponse, Error>(
    apiUrl,
    fetcher,
    {
      refreshInterval: (data) => {
        return data?.completed === true ? 0 : 5000
      },
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  )

  // Group rooms by type
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

  const handleBookNow = () => {
    if (isLoggedIn && selectedRooms.length > 0) {
      navigate(
        `/booking/${hotelId}?destination_id=${destinationId}&checkin=${searchParams.checkin}&checkout=${searchParams.checkout}&lang=en_US&currency=SGD&country_code=SG&guests=${guests}`,
      )
    }
  }

  const pageTitle = `Hotel Details`

  return (
    <>
      <NavBar pageTitle={pageTitle} />
      {hotelId && <HotelInfo hotelId={hotelId} />}

      {/* Room Selection Summary */}
      {selectedRooms.length > 0 && (
        <div className="mb-6 p-4 bg-base-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            Selected Rooms (
            {selectedRooms.length}
            /
            {maxRooms}
            )
          </h3>
          <div className="space-y-2">
            {selectedRooms.map((room, index) => (
              <div
                key={`${room.key}-${index}`}
                className="flex justify-between items-center"
              >
                <span>{room.roomNormalizedDescription}</span>
                <span className="font-semibold">
                  $
                  {room.price}
                </span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between items-center font-bold">
              <span>Total:</span>
              <span className="text-green-600">
                $
                {getTotalPrice()}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Room Options (Select up to
          {' '}
          {maxRooms}
          {' '}
          room
          {maxRooms !== 1 ? 's' : ''}
          )
        </h2>

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
                          {rooms[0]?.long_description && (
                            <div
                              tabIndex={0}
                              className="collapse collapse-plus bg-base-100 border-base-300 border mb-4"
                            >
                              <div className="collapse-title font-semibold">
                                View Room Details
                              </div>
                              <div
                                className="collapse-content text-sm"
                                dangerouslySetInnerHTML={{
                                  __html: rooms[0].long_description,
                                }}
                              />
                            </div>
                          )}
                          {rooms?.map(room => (
                            <RoomCard
                              key={room.key}
                              room={room}
                              currency={searchParams.currency || undefined}
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
              <div className="card card-side bg-base-100 shadow-sm dark:shadow-xl">
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

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleBookNow}
          className={`btn btn-primary ${
            !isLoggedIn || selectedRooms.length === 0 ? 'btn-disabled' : ''
          }`}
          disabled={!isLoggedIn || selectedRooms.length === 0}
        >
          Book Selected Rooms (
          {selectedRooms.length}
          )
        </button>

        <Link
          href="/results/WD0M?checkin=2025-10-01&checkout=2025-10-07&lang=en_US&currency=SGD&country_code=SG&guests=2|2"
          className="btn btn-secondary"
        >
          Back to Results
        </Link>

        <Link href="/" className="btn btn-outline">
          Back to Home
        </Link>
      </div>
    </>
  )
}
