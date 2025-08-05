import { type ImageDetails } from '../../types/image'
import { useState } from 'react'
interface ImageCarouselProps {
  imageDetails: ImageDetails
  hotelName: string
}

export const ImageCarousel = ({
  imageDetails,
  hotelName,
}: ImageCarouselProps) => {
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  if (!imageDetails || imageDetails.count === 0) {
    return null
  }

  // Create array of image indices from 1 to count
  const imageIndices = Array.from(
    { length: imageDetails.count },
    (_, i) => i + 1,
  )

  const handleImageError = (imageIndex: number) => {
    setFailedImages(prev => new Set(prev).add(imageIndex))
  }

  const handleImageLoad = (imageIndex: number) => {
    setFailedImages((prev) => {
      const newSet = new Set(prev)
      newSet.delete(imageIndex)
      return newSet
    })
  }

  return (
    <div className="carousel carousel-center bg-base-100 border-base-300 border rounded-box max-w-full space-x-4 p-4">
      {imageIndices.map((imageIndex, arrayIndex) => {
        const imageUrl = `${imageDetails.prefix}${imageIndex}${imageDetails.suffix}`
        const hasError = failedImages.has(imageIndex)

        if (hasError) {
          return null // Don't render failed images
        }

        return (
          <div key={arrayIndex} className="carousel-item">
            <img
              src={imageUrl}
              alt={`${hotelName} - Image ${imageIndex}`}
              className="rounded-box w-64 h-40 object-cover"
              loading={arrayIndex === 0 ? 'eager' : 'lazy'}
              onError={() => handleImageError(imageIndex)}
              onLoad={() => handleImageLoad(imageIndex)}
            />
          </div>
        )
      })}
    </div>
  )
}
