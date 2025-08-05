import {
  Map,
  type MapRef,
  Source,
  Layer,
  Popup,
  type MapLayerMouseEvent,
} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAPTILER_TOKEN } from '../../config/api'
import type { StitchedHotel } from '../../types/params'
import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'wouter'
import { type HotelProperties, handleMapClick, loadMarkerImage } from '../../utils/mapselectUtils'

interface MapSelectProps {
  hotels: StitchedHotel[]
  checkin?: string
  checkout?: string
  guests?: string
  destinationId?: string
}

interface HoverInfo {
  longitude: number
  latitude: number
  properties: HotelProperties
}

export const MapSelect = ({
  hotels,
  destinationId,
  checkin,
  checkout,
  guests,
}: MapSelectProps) => {
  const [, navigate]: [unknown, (to: string) => void] = useLocation()
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)
  const [selectedFeature, setSelectedFeature]
    = useState<HotelProperties | null>(null)

  useEffect(() => {
    if (selectedFeature) {
      navigate(
        `/hotels/detail/${selectedFeature?.id}?destination_id=${destinationId}&checkin=${checkin}&checkout=${checkout}&lang=en_US&currency=SGD&country_code=SG&guests=${guests}`,
      )
    }
  }, [selectedFeature, destinationId, checkin, checkout, guests, navigate])

  useEffect(() => {
    if (hotels[0]) {
      mapRef.current?.flyTo({
        center: [hotels[0].longitude, hotels[0].latitude],
        zoom: 11,
        speed: 1.0,
      })
    }
    console.log(mapRef.current)
  }, [hotels])

  const mapRef = useRef<MapRef | null>(null)

  return (
    <div className="w-full h-75 rounded-lg overflow-hidden shadow-md">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: hotels[0]?.longitude ?? 103.8198,
          latitude: hotels[0]?.latitude ?? 1.3521,
          zoom: 1,
        }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_TOKEN}`}
        onClick={e => handleMapClick(e, setSelectedFeature)}
        onMouseMove={(e: MapLayerMouseEvent) => {
          const feature = e.features?.[0]
          if (feature) {
            setHoverInfo({
              longitude: e.lngLat.lng,
              latitude: e.lngLat.lat,
              properties: feature.properties as HotelProperties,
            })
          }
          else {
            setHoverInfo(null)
          }
        }}
        onLoad={(e) => {
          void loadMarkerImage(e.target)
        }}
        interactiveLayerIds={['point-layer']}
      >
        <Source
          id="my-geojson"
          type="geojson"
          data={{
            type: 'FeatureCollection',
            features: hotels.map(hotel => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [hotel.longitude, hotel.latitude],
              },
              properties: {
                name: hotel.name,
                address: hotel.address,
                price: hotel.price ?? 0,
                rating: hotel.rating,
                id: hotel.id,
                icon: 'marker',
              } satisfies HotelProperties,
            })),
          }}
        >
          <Layer
            id="point-layer"
            type="symbol"
            layout={{
              'icon-image': ['get', 'icon'],
              'icon-size': 0.05,
              'icon-allow-overlap': true,
              'text-field': ['get', 'title'],
              'text-offset': [0, 1.5],
              'text-anchor': 'top',
            }}
          />
        </Source>

        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="left"
          >
            <div>
              <strong>{hoverInfo.properties.name}</strong>
              <br />
              <strong>Address</strong>
              :
              {hoverInfo.properties.address}
              <br />
              <strong>Price</strong>
              :
              {hoverInfo.properties.price || 'NA'}
              <br />
              <strong>Rating</strong>
              :
              {hoverInfo.properties.rating}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
