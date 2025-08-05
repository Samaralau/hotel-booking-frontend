import type { Room } from '../../types/hotel'
import useAuthStore from '../../stores/AuthStore'
import useRoomBookingStore from '../../stores/RoomBookingStore'

interface RoomCardProps {
  room: Room
  currency?: string
}

const getBreakfastDisplay = (breakfastInfo: string) => {
  switch (breakfastInfo) {
    case 'hotel_detail_room_only':
      return 'Room Only'
    case 'hotel_detail_breakfast_included':
      return 'Breakfast Included'
    case 'hotel_detail_breakfast_for_2_included':
      return 'Breakfast for 2 Included'
    default:
      return breakfastInfo // fallback to original value
  }
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const heroImage = room.images?.[0]
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const selectedRooms = useRoomBookingStore(state => state.selectedRooms)
  const canAddMoreRooms = useRoomBookingStore(state => state.canAddMoreRooms)
  const addRoom = useRoomBookingStore(state => state.addRoom)
  const removeRoom = useRoomBookingStore(state => state.removeRoom)

  // Check if this specific room is already selected
  const isRoomSelected = selectedRooms.some(
    selectedRoom => selectedRoom.key === room.key,
  )

  const handleAddRoom = () => {
    if (isLoggedIn && canAddMoreRooms()) {
      addRoom({
        key: room.key,
        roomNormalizedDescription: room.roomNormalizedDescription,
        price: room.price,
      })
    }
  }

  const handleRemoveRoom = () => {
    if (isLoggedIn && isRoomSelected) {
      removeRoom(room.key)
    }
  }

  return (
    <div
      className={`card card-side shadow-sm dark:shadow-xl ${
        isRoomSelected ? 'bg-primary/10 border-2 border-primary' : 'bg-base-100'
      }`}
    >
      {heroImage && (
        <figure className="p-4 flex shrink-0">
          <img
            src={heroImage.url}
            alt={room.roomNormalizedDescription}
            className="h-48 rounded-xl aspect-square"
          />
        </figure>
      )}
      <div className="card-body">
        <div className="flex-1">
          {room.roomAdditionalInfo?.breakfastInfo && (
            <h1 className="text-lg font-bold">
              {getBreakfastDisplay(room.roomAdditionalInfo.breakfastInfo)}
            </h1>
          )}
          <div className="flex flex-wrap mt-4 gap-4 text-lg">
            {room.free_cancellation
              ? (
                <div className="badge badge-success text-success-content">
                  Free Cancellation
                </div>
              )
              : (
                <div className="badge badge-warning text-warning-content">
                  Non-Refundable
                </div>
              )}
          </div>
        </div>

        <div className="card-actions justify-end">
          <div className="flex flex-col items-end gap-2">
            <p className="text-green-600 font-semibold text-xl">
              $
              {' '}
              {room.price}
            </p>

            <div className="flex gap-2">
              {/* Remove Room Button */}
              {isRoomSelected && (
                <button
                  className="btn btn-outline btn-error"
                  onClick={handleRemoveRoom}
                  disabled={!isLoggedIn}
                >
                  Remove
                </button>
              )}

              {/* Add Room Button */}
              <button
                className={`btn ${
                  isLoggedIn && canAddMoreRooms()
                    ? 'btn-primary'
                    : 'btn-primary btn-disabled'
                }`}
                onClick={handleAddRoom}
                disabled={!isLoggedIn || !canAddMoreRooms()}
              >
                {isRoomSelected ? 'Add Another' : 'Add Room'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
