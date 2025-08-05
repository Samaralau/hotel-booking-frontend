import { useSearch } from 'wouter'
import { type SearchParams } from '../types/params'

export const useSearchParams = (): SearchParams => {
  const search = useSearch()
  const searchParams = new URLSearchParams(search)

  return {
    destination_id: searchParams.get('destination_id'),
    checkin: searchParams.get('checkin'),
    checkout: searchParams.get('checkout'),
    lang: searchParams.get('lang'),
    currency: searchParams.get('currency'),
    country_code: searchParams.get('country_code'),
    guests: searchParams.get('guests'),
  }
}
