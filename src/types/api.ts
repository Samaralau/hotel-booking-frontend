import type { DestinationSearchResult } from './destination'

export interface PriceBaseResponse {
  searchCompleted: boolean | null
  completed: boolean
  status: string | null
  currency: string | null
}

export interface DestinationResponse {
  success: boolean
  query: string
  searchType: 'uid' | 'name'
  count: number
  results: DestinationSearchResult[]
}
