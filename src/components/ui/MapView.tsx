import { Map, Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAPTILER_TOKEN } from '../../config/api'

interface MapViewProps {
  lat: number
  lng: number
}

export const MapView = ({ lat, lng }: MapViewProps) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <Map
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 14,
        }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_TOKEN}`}
      >
        <Marker longitude={lng} latitude={lat} anchor="bottom"></Marker>
      </Map>
    </div>
  )
}
