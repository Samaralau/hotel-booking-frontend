import type { MapLayerMouseEvent } from 'maplibre-gl'
import marker from '../assets/marker.png'

export interface HotelProperties {
  name: string
  address: string
  price: number
  rating: number
  id: string
  icon: string
}

export const handleMapClick = (
  e: MapLayerMouseEvent,
  setSelectedFeature: React.Dispatch<React.SetStateAction<HotelProperties | null>>,
) => {
  const feature = e.features?.[0]
  if (feature) {
    setSelectedFeature(feature.properties as HotelProperties)
  }
}

export const loadMarkerImage = async (map: maplibregl.Map) => {
  try {
    const image = await map.loadImage(marker)
    if (image && !map.hasImage('marker')) {
      map.addImage('marker', image.data)
    }
  }
  catch (error) {
    console.error('Error loading marker image:', error)
  }
}
