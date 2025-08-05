import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface RoomDetails {
  key: string
  roomNormalizedDescription: string
  price: number
}

interface RoomBookingStore {
  hotelId: string | null
  selectedRooms: RoomDetails[]
  checkin: string | null
  checkout: string | null
  guests: string | null
  maxSelectedRooms: number
  setRoomBookingData: (data: {
    hotelId: string
    checkin: string
    checkout: string
    guests: string
  }) => void
  setMaxSelectedRooms: (max: number) => void
  addRoom: (room: RoomDetails) => void
  removeRoom: (roomKey: string) => void
  clearRoomBookingData: () => void
  canAddMoreRooms: () => boolean
  getTotalPrice: () => number
}

const useRoomBookingStore = create<RoomBookingStore>()(
  devtools(
    (set, get) => ({
      hotelId: null,
      selectedRooms: [],
      checkin: null,
      checkout: null,
      guests: null,
      maxSelectedRooms: 1,

      setRoomBookingData: data =>
        set({
          hotelId: data.hotelId,
          checkin: data.checkin,
          checkout: data.checkout,
          guests: data.guests,
        }),

      setMaxSelectedRooms: max => set({ maxSelectedRooms: max }),

      addRoom: room =>
        set(state => ({
          selectedRooms: [...state.selectedRooms, room],
        })),

      removeRoom: roomKey =>
        set(state => ({
          selectedRooms: state.selectedRooms.filter(
            room => room.key !== roomKey,
          ),
        })),

      clearRoomBookingData: () =>
        set({
          hotelId: null,
          selectedRooms: [],
          checkin: null,
          checkout: null,
          guests: null,
          maxSelectedRooms: 1,
        }),

      canAddMoreRooms: () => {
        const state = get()
        return state.selectedRooms.length < state.maxSelectedRooms
      },

      getTotalPrice: () => {
        const state = get()
        // 2 decimal places
        return parseFloat(
          state.selectedRooms
            .reduce((total, room) => total + room.price, 0)
            .toFixed(2),
        )
      },
    }),
    {
      name: 'RoomBookingStore',
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
)

export default useRoomBookingStore
