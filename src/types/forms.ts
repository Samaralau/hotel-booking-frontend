export type Range = {
  from: Date | undefined
  to?: Date | undefined
}

type rangeStore = {
  range: Range
  setRange: (range: Range) => void
}

type adultStore = {
  Adult: number
  setAdult: (val: number | ((prev: number) => number)) => void
}

type childrenStore = {
  Children: number
  setChildren: (val: number | ((prev: number) => number)) => void
}

type roomStore = {
  Room: number
  setRoom: (val: number | ((prev: number) => number)) => void
}

export type CombinedStore = rangeStore & adultStore & childrenStore & roomStore

export type Country = {
  uid: string
  term: string
  lat: number
  lng: number
}
