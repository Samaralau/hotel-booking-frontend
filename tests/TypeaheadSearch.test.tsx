import { describe, it, vi, expect } from 'vitest'
import { handleKeyDown } from '../src/utils/typeaheadsearchUtils'
import type { Destination } from '../src/types/destination'

describe('handleKeyDown Unit Test', () => {
  it('should call setHighlightedIndex with the correct value when ArrowDown is pressed', () => {
    const setHighlightedIndex = vi.fn()
    const setStartIndex = vi.fn()
    const suggestions: Destination[] = [{
      uid: '1', term: 'Paris', type: 'city',
      lat: 0,
      lng: 0,
    },
    {
      uid: '2', term: 'London', type: 'city',
      lat: 0,
      lng: 0,
    }]
    const startIndex = 0
    const maxVisibleItems = 4
    const handleSelect = vi.fn()

    const event = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>
    handleKeyDown(
      event,
      0,
      setHighlightedIndex,
      suggestions,
      startIndex,
      setStartIndex,
      maxVisibleItems,
      handleSelect,
    )

    expect(setHighlightedIndex).toHaveBeenCalled()
    const updateFn = setHighlightedIndex.mock.calls[0][0] as (prev: number) => number
    expect(updateFn(1)).toBe(1)
  })

  it('should call setHighlightedIndex with the correct value when ArrowUp is pressed', () => {
    const setHighlightedIndex = vi.fn()
    const setStartIndex = vi.fn()
    const suggestions: Destination[] = [{
      uid: '1', term: 'Paris', type: 'city',
      lat: 0,
      lng: 0,
    },
    {
      uid: '2', term: 'London', type: 'city',
      lat: 0,
      lng: 0,
    }]
    const startIndex = 1
    const maxVisibleItems = 4
    const handleSelect = vi.fn()
    const event = {
      key: 'ArrowUp',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>
    handleKeyDown(
      event,
      1,
      setHighlightedIndex,
      suggestions,
      startIndex,
      setStartIndex,
      maxVisibleItems,
      handleSelect,
    )

    expect(setHighlightedIndex).toHaveBeenCalled()
    const updateFn = setHighlightedIndex.mock.calls[0][0] as (prev: number) => number
    expect(updateFn(1)).toBe(0)
  })

  it('should call handleSelect with the correct suggestion when Enter is pressed', () => {
    const setHighlightedIndex = vi.fn()
    const setStartIndex = vi.fn()
    const suggestions: Destination[] = [{
      uid: '1', term: 'Paris', type: 'city',
      lat: 0,
      lng: 0,
    },
    {
      uid: '2', term: 'London', type: 'city',
      lat: 0,
      lng: 0,
    }]
    const startIndex = 0
    const maxVisibleItems = 4
    const handleSelect = vi.fn()

    const event = {
      key: 'Enter',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>
    handleKeyDown(
      event,
      0,
      setHighlightedIndex,
      suggestions,
      startIndex,
      setStartIndex,
      maxVisibleItems,
      handleSelect,
    )

    expect(handleSelect).toHaveBeenCalledWith(suggestions[0])
  })
})
