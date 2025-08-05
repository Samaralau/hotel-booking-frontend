// adapted from backend
// excluded HotelsSearchParams and HotelsSearchParams
import type { Image, ImageDetails } from './image'
export interface MarketRate {
  supplier: string
  rate: number
}
export interface HotelPrice {
  id: string
  searchRank: number
  price: number
  market_rates: MarketRate[]
}
export interface HotelCategory {
  name: string
  score: number
  popularity: number
}
// avoid potential key conflicts (overall is the only guaranteed key)
export type HotelCategories = {
  overall: HotelCategory
} & Record<string, HotelCategory>
export interface HotelAmenities {
  [key: string]: boolean | undefined
}
export interface Hotel {
  id: string
  name: string
  latitude: number
  longitude: number
  address: string
  rating: number
  categories: HotelCategories
  description: string
  amenities: HotelAmenities
  image_details: ImageDetails
  hires_image_index: string
  number_of_images: number
  checkin_time: string
}
export interface Room {
  key: string // Booking key for unique identification
  type: string
  roomNormalizedDescription: string
  free_cancellation: boolean
  description: string
  long_description: string
  images: Image[]
  amenities: string[]
  price: number
  market_rates: MarketRate[]
  roomAdditionalInfo: RoomAdditionalInfo
}
export interface RoomAdditionalInfo {
  breakfastInfo: string
  displayFields: {
    special_check_in_instructions: string
    check_in_instructions: string
    know_before_you_go: string
    fees_optional: string
    fees_mandatory: string | null // may need to clarify with Ascenda
    kaligo_service_fee: number
    hotel_fees: [] // may need to clarify with Ascenda
    surcharges: Surcharge[]
  }
}
interface Surcharge {
  type: string
  amount: number
}
