const flyTo = vi.fn()
const mapRef = { current: { flyTo } }

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useRef: vi.fn(() => mapRef),
  }
})

import * as React from 'react'
import { handleMapClick, loadMarkerImage } from '../src/utils/mapselectUtils'
import { MapSelect } from '../src/components/ui/MapSelect'
import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import type { StitchedHotel, HotelCategories, HotelAmenities, ImageDetails } from '../src/types/params'
import marker from '../src/assets/marker.png'
import { LngLat, MapGeoJSONFeature, MapLayerMouseEvent, Point } from 'maplibre-gl'

let lastOnMouseMove: ((event: MapLayerMouseEvent) => void) | null = null
let lastOnClick: ((event: MapLayerMouseEvent) => void) | null = null

interface MockMapProps {
  ref?: React.RefObject<unknown>
  onMouseMove?: (event: MapLayerMouseEvent) => void
  onClick?: (event: MapLayerMouseEvent) => void
  children?: React.ReactNode
  [key: string]: unknown
}

interface MockComponentProps {
  children?: React.ReactNode
  [key: string]: unknown
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const createMockMapEvent = (hotel: StitchedHotel): Partial<MapLayerMouseEvent> => ({
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [hotel.longitude, hotel.latitude],
    },
    properties: hotel,
    id: hotel.id,
    source: 'my-geojson',
    sourceLayer: '',
    state: {},
  }] as unknown as MapGeoJSONFeature[],
  lngLat: {
    lng: hotel.longitude, lat: hotel.latitude,
    wrap: function (): LngLat {
      throw new Error('Function not implemented.')
    },
    toArray: function (): [number, number] {
      throw new Error('Function not implemented.')
    },
    distanceTo: function (_lngLat: LngLat): number {
      throw new Error('Function not implemented.')
    },
  },
  point: {
    x: 0, y: 0,
    clone: function (): Point {
      throw new Error('Function not implemented.')
    },
    add: function (_p: Point): Point {
      throw new Error('Function not implemented.')
    },
    _add: function (_p: Point): Point {
      throw new Error('Function not implemented.')
    },
    sub: function (_p: Point): Point {
      throw new Error('Function not implemented.')
    },
    _sub: function (_p: Point): Point {
      throw new Error('Function not implemented.')
    },
    multiByPoint: function (_p: Point): Point {
      throw new Error('Function not implemented.')
    },
    divByPoint: function (_p: Point): Point {
      throw new Error('Function not implemented.')
    },
    mult: function (_k: number): Point {
      throw new Error('Function not implemented.')
    },
    _mult: function (_k: number): Point {
      throw new Error('Function not implemented.')
    },
    div: function (_k: number): Point {
      throw new Error('Function not implemented.')
    },
    _div: function (_k: number): Point {
      throw new Error('Function not implemented.')
    },
    rotate: function (_k: number): Point {
      throw new Error('Function not implemented.')
    },
    _rotate: function (_k: number): Point {
      throw new Error('Function not implemented.')
    },
    rotateAround: function (_k: number, _p: Point): Point {
      throw new Error('Function not implemented.')
    },
    _rotateAround: function (_k: number, _p: Point): Point {
      throw new Error('Function not implemented.')
    },
    matMult: function (_m: number[]): Point {
      throw new Error('Function not implemented.')
    },
    _matMult: function (_m: number[]): Point {
      throw new Error('Function not implemented.')
    },
    unit: function (): Point {
      throw new Error('Function not implemented.')
    },
    _unit: function (): Point {
      throw new Error('Function not implemented.')
    },
    perp: function (): Point {
      throw new Error('Function not implemented.')
    },
    _perp: function (): Point {
      throw new Error('Function not implemented.')
    },
    round: function (): Point {
      throw new Error('Function not implemented.')
    },
    _round: function (): Point {
      throw new Error('Function not implemented.')
    },
    mag: function (): number {
      throw new Error('Function not implemented.')
    },
    equals: function (_other: Point): boolean {
      throw new Error('Function not implemented.')
    },
    dist: function (_p: Point): number {
      throw new Error('Function not implemented.')
    },
    distSqr: function (_p: Point): number {
      throw new Error('Function not implemented.')
    },
    angle: function (): number {
      throw new Error('Function not implemented.')
    },
    angleTo: function (_b: Point): number {
      throw new Error('Function not implemented.')
    },
    angleWith: function (_b: Point): number {
      throw new Error('Function not implemented.')
    },
    angleWithSep: function (_x: number, _y: number): number {
      throw new Error('Function not implemented.')
    },
  },
})
/* eslint-enable @typescript-eslint/no-unused-vars */

vi.mock('react-map-gl/maplibre', () => ({
  Map: (props: MockMapProps) => {
    if (props.ref) {
      props.ref.current = { flyTo }
    }
    lastOnMouseMove = props.onMouseMove ?? null
    lastOnClick = props.onClick ?? null
    return <div data-testid="map">{props.children}</div>
  },
  Source: (props: MockComponentProps) => <div>{props.children}</div>,
  Layer: () => <div />,
  Popup: (props: MockComponentProps) => <div data-testid="popup">{props.children}</div>,
}))

const mockNavigate = vi.fn()
vi.mock('wouter', () => ({
  useLocation: () => [null, mockNavigate],
}))

const mockHotelCategories: HotelCategories = ['Luxury', 'Business'] as unknown as HotelCategories
const mockHotelAmenities: HotelAmenities = {
  'Free WiFi': true,
  'Pool': true,
  'Spa': false,
}
const mockImageDetails: ImageDetails = {
  suffix: 'jpg',
  count: 1,
  prefix: 'hotel-image',
}
const mockHotel: StitchedHotel = {
  id: '1',
  name: 'Hotel California',
  latitude: 34.0522,
  longitude: -118.2437,
  address: '123 Main St, California',
  price: 200,
  rating: 4.5,
  categories: mockHotelCategories,
  amenities: mockHotelAmenities,
  image_details: mockImageDetails,
  description: 'A lovely hotel in California.',
}

describe('MapSelect', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    render(
      <MapSelect
        hotels={[mockHotel]}
        destinationId="A6Dz"
        checkin="2025-10-01"
        checkout="2025-10-05"
        guests="2"
      />,
    )
    expect(screen.getByTestId('map')).toBeInTheDocument()
  })

  it('calls setSelectedFeature with the correct hotel on map click', () => {
    const setSelectedFeature = vi.fn()
    handleMapClick(
      { features: [{ properties: mockHotel }] } as unknown as MapLayerMouseEvent,
      setSelectedFeature,
    )
    expect(setSelectedFeature).toHaveBeenCalledWith(mockHotel)
  })

  it('loads marker image', async () => {
    const map = { loadImage: vi.fn().mockResolvedValue({ data: marker }), hasImage: vi.fn(), addImage: vi.fn() }
    await loadMarkerImage(map as unknown as maplibregl.Map)
    expect(map.loadImage).toHaveBeenCalledWith(expect.any(String))
    expect(map.hasImage).toHaveBeenCalledWith('marker')
    expect(map.addImage).toHaveBeenCalledWith('marker', marker)
  })

  it('handles error loading marker image', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const map = { loadImage: vi.fn().mockRejectedValue(new Error('Load error')), hasImage: vi.fn(), addImage: vi.fn() }

    await loadMarkerImage(map as unknown as maplibregl.Map)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading marker image:', expect.any(Error))
    consoleErrorSpy.mockRestore()
  })

  it('shows popup on mouse move over a feature', async () => {
    render(
      <MapSelect
        hotels={[mockHotel]}
        destinationId="A6Dz"
        checkin="2025-10-01"
        checkout="2025-10-05"
        guests="2"
      />,
    )

    act(() => {
      if (lastOnMouseMove) {
        lastOnMouseMove(createMockMapEvent(mockHotel) as MapLayerMouseEvent)
      }
    })

    await waitFor(() => {
      expect(screen.getByTestId('popup')).toHaveTextContent('Hotel California')
      expect(screen.getByTestId('popup')).toHaveTextContent('123 Main St, California')
    })
  })

  it('simulates click on map layer and triggers navigation', async () => {
    const destinationId = 'A6Dz'
    const checkin = '2025-10-01'
    const checkout = '2025-10-05'
    const guests = '2'

    render(
      <MapSelect
        hotels={[mockHotel]}
        destinationId={destinationId}
        checkin={checkin}
        checkout={checkout}
        guests={guests}
      />,
    )

    act(() => {
      if (lastOnClick) {
        lastOnClick(createMockMapEvent(mockHotel) as MapLayerMouseEvent)
      }
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining(`/hotels/detail/${mockHotel.id}?destination_id=${destinationId}&checkin=${checkin}&checkout=${checkout}&lang=en_US&currency=SGD&country_code=SG&guests=${guests}`),
      )
    })
  })

  it('calls flyTo on mapRef when hotels prop changes', async () => {
    const initialHotels = [{
      id: '1',
      name: 'Hotel California',
      latitude: 34.0522,
      longitude: -118.2437,
      address: '123 Main St, California',
      price: 200,
      rating: 4.5,
      categories: mockHotelCategories,
      amenities: mockHotelAmenities,
      image_details: mockImageDetails,
      description: 'A lovely hotel in California.',
      icon: 'marker',
    }]

    const newHotels = [{
      id: '2',
      name: 'Hotel New',
      latitude: 40.7128,
      longitude: -74.0060,
      address: '456 New St, New York',
      price: 300,
      rating: 5.0,
      categories: mockHotelCategories,
      amenities: mockHotelAmenities,
      image_details: mockImageDetails,
      description: 'A brand new hotel in New York.',
      icon: 'marker',
    }]

    const { rerender } = render(
      <MapSelect
        hotels={initialHotels}
        destinationId="A6Dz"
        checkin="2025-10-01"
        checkout="2025-10-05"
        guests="2"
      />,
    )

    act(() => {
      rerender(
        <MapSelect
          hotels={newHotels}
          destinationId="A6Dz"
          checkin="2025-10-01"
          checkout="2025-10-05"
          guests="2"
        />,
      )
    })

    await waitFor(() => {
      expect(flyTo).toHaveBeenCalledWith({
        center: [newHotels[0].longitude, newHotels[0].latitude],
        zoom: 11,
        speed: 1.0,
      })
    })
  })
})
