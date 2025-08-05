// copied from backend
// got some capitalised duplicates in the JSON provided
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
export const destinationTypes = [
  'airport',
  'anchor',
  'business',
  'casino',
  'city',
  'civic',
  'district',
  'golf',
  'historic',
  'icecream',
  'medical',
  'monument',
  'museums',
  'school',
  'shopping',
  'sign',
  'skiing',
  'stadium',
  'sunglass',
  'theater',
  'tree',
  'winery',
] as const

// https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html
export type DestinationType = (typeof destinationTypes)[number]

// uid is NOT unique (see YPJF)
export interface Destination {
  term: string
  uid: string
  lat: number
  lng: number
  type: DestinationType
}

export interface DestinationSearchResult extends Destination {
  score: number
  highlighted: string
}
