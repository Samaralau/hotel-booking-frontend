import type { Destination } from '../types/destination'

export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  highlightedIndex: number | null,
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number | null>>,
  suggestions: Destination[],
  startIndex: number,
  setStartIndex: React.Dispatch<React.SetStateAction<number>>,
  maxVisibleItems: number,
  handleSelect: (destination: Destination) => void,
) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    setHighlightedIndex((prev) => {
      const next = Math.min((prev ?? -1) + 1, suggestions.length - 1)
      if (next >= startIndex + maxVisibleItems) {
        setStartIndex(s => s + 1)
      }
      return next
    })
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    setHighlightedIndex((prev) => {
      const next = Math.max((prev ?? 1) - 1, 0)
      if (next < startIndex) {
        setStartIndex(s => Math.max(s - 1, 0))
      }
      return next
    })
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    if (
      highlightedIndex !== null
      && highlightedIndex >= 0
      && highlightedIndex < suggestions.length
    ) {
      const selectedItem = suggestions[highlightedIndex]
      handleSelect(selectedItem)
    }
  }
}
