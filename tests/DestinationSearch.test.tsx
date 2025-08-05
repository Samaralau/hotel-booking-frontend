import DestinationSearch from '../src/components/ui/DestinationSearch'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { useFormStore, useCountryStore } from '../src/store'
import { act } from 'react'

vi.mock('../src/store', () => ({
  useFormStore: vi.fn(),
  useCountryStore: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('wouter', () => ({
  useLocation: () => [null, mockNavigate],
}))

const mockUseFormStore = vi.mocked(useFormStore)
const mockUseCountryStore = vi.mocked(useCountryStore)

type Range = { from: Date | undefined, to?: Date | undefined }
type SetRangeFunction = (range: Range) => void
type SetNumberFunction = (value: number | ((prev: number) => number)) => void
let mockStoreState: {
  range: Range
  Adult: number
  Children: number
  Room: number
  setRange: SetRangeFunction
  setAdult: SetNumberFunction
  setChildren: SetNumberFunction
  setRoom: SetNumberFunction
} = {
  range: {
    from: new Date('Thu Aug 4 2025 00:00:00 GMT+0800 (Singapore Standard Time)'),
    to: new Date('Fri Aug 5 2025 00:00:00 GMT+0800 (Singapore Standard Time)'),
  },
  Adult: 1,
  Children: 1,
  Room: 2,
  setRange: vi.fn(),
  setAdult: vi.fn(),
  setChildren: vi.fn(),
  setRoom: vi.fn(),
}

mockUseFormStore.mockImplementation((selector) => {
  if (typeof selector === 'function') {
    return selector(mockStoreState)
  }
  return mockStoreState
})

let mockCountryStoreState = {
  country: { uid: 'A6Dz', term: 'Rome, Italy', lat: 41.895466, lng: 12.482324 },
  setCountry: vi.fn(),
}

mockUseFormStore.mockImplementation((selector) => {
  if (typeof selector === 'function') {
    return selector(mockStoreState)
  }
  return mockStoreState
})

mockUseCountryStore.mockImplementation((selector) => {
  if (typeof selector === 'function') {
    return selector(mockCountryStoreState)
  }
  return mockCountryStoreState
})

describe('DestinationSearch Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
  })

  it('shows error when start date and end date are empty', async () => {
    mockStoreState = {
      range: { from: undefined, to: undefined },
      Adult: 1,
      Children: 1,
      Room: 2,
      setRange: vi.fn(),
      setAdult: vi.fn(),
      setChildren: vi.fn(),
      setRoom: vi.fn(),
    }
    mockCountryStoreState = {
      country: { uid: 'A6Dz', term: 'Rome, Italy', lat: 41.895466, lng: 12.482324 },
      setCountry: vi.fn(),
    }

    render(<DestinationSearch />)

    act(() => {
      fireEvent.click(screen.getByTestId('search-button'))
    })

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('please select a start date and an end date.'),
    )).toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('start date must be at least 3 days from today.'),
    )).not.toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('end date must be at least 1 day after the start date.'),
    )).not.toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please enter a destination.'),
    )).not.toBeInTheDocument()
  })

  it('shows error when only country is empty', async () => {
    mockStoreState = {
      range: {
        from: new Date('Thu Aug 4 2025 00:00:00 GMT+0800 (Singapore Standard Time)'),
        to: new Date('Fri Aug 5 2025 00:00:00 GMT+0800 (Singapore Standard Time)'),
      },
      Adult: 1,
      Children: 1,
      Room: 2,
      setRange: vi.fn(),
      setAdult: vi.fn(),
      setChildren: vi.fn(),
      setRoom: vi.fn(),
    }
    mockCountryStoreState = {
      country: { uid: '', term: '', lat: 0, lng: 0 },
      setCountry: vi.fn(),
    }
    render(<DestinationSearch />)

    act(() => {
      fireEvent.click(screen.getByTestId('search-button'))
    })

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please select a start date and an end date.'),
    )).not.toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('start date must be at least 3 days from today.'),
    )).not.toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('end date must be at least 1 day after the start date.'),
    )).not.toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('please enter a destination.'),
    )).toBeInTheDocument()
  })

  it('shows error when only start date is not at least 3 days after today', async () => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() + 2)
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
    mockStoreState = {
      range: { from: startDate, to: endDate },
      Adult: 1,
      Children: 1,
      Room: 2,
      setRange: vi.fn(),
      setAdult: vi.fn(),
      setChildren: vi.fn(),
      setRoom: vi.fn(),
    }

    mockUseCountryStore.mockReturnValue({
      country: { uid: 'A6Dz', term: 'Rome, Italy', lat: 41.895466, lng: 12.482324 },
      setCountry: vi.fn(),
    })

    render(<DestinationSearch />)

    act(() => {
      fireEvent.click(screen.getByTestId('search-button'))
    })

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please select a start date and an end date.'),
    )).not.toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('start date must be at least 3 days from today.'),
    )).toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('end date must be at least 1 day after the start date.'),
    )).not.toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please enter a destination.'),
    )).not.toBeInTheDocument()
  })

  it('shows error when only end date is not at least 1 day after start date', async () => {
    const today = new Date()
    const startDate = new Date(today)
    const endDate = new Date(today)
    startDate.setDate(today.getDate() + 3)
    endDate.setDate(startDate.getDate())
    mockStoreState = {
      range: { from: startDate, to: endDate },
      Adult: 1,
      Children: 1,
      Room: 2,
      setRange: vi.fn(),
      setAdult: vi.fn(),
      setChildren: vi.fn(),
      setRoom: vi.fn(),
    }
    mockCountryStoreState = {
      country: { uid: 'A6Dz', term: 'Rome, Italy', lat: 41.895466, lng: 12.482324 },
      setCountry: vi.fn(),
    }

    render(<DestinationSearch />)

    act(() => {
      fireEvent.click(screen.getByTestId('search-button'))
    })

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please select a start date and an end date.'),
    )).not.toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('start date must be at least 3 days from today.'),
    )).not.toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('end date must be at least 1 day after the start date.'),
    )).toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please enter a destination.'),
    )).not.toBeInTheDocument()
  })

  it('shows error when start date is not at least 3 days after today, end date is not at least 1 day after start date', async () => {
    const today = new Date()
    const startDate = new Date(today)
    const endDate = new Date(today)
    startDate.setDate(today.getDate() + 2)
    endDate.setDate(startDate.getDate())
    mockStoreState = {
      range: { from: startDate, to: endDate },
      Adult: 1,
      Children: 1,
      Room: 2,
      setRange: vi.fn(),
      setAdult: vi.fn(),
      setChildren: vi.fn(),
      setRoom: vi.fn(),
    }
    mockCountryStoreState = {
      country: { uid: 'A6Dz', term: 'Rome, Italy', lat: 41.895466, lng: 12.482324 },
      setCountry: vi.fn(),
    }

    render(<DestinationSearch />)

    act(() => {
      fireEvent.click(screen.getByTestId('search-button'))
    })

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please select a start date and an end date.'),
    )).not.toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('start date must be at least 3 days from today.'),
    )).toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('end date must be at least 1 day after the start date.'),
    )).toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please enter a destination.'),
    )).not.toBeInTheDocument()
  })

  it('shows error when both dates and country are empty', async () => {
    mockStoreState = {
      range: { from: undefined, to: undefined },
      Adult: 1,
      Children: 1,
      Room: 2,
      setRange: vi.fn(),
      setAdult: vi.fn(),
      setChildren: vi.fn(),
      setRoom: vi.fn(),
    }

    const startDate: Date | undefined = undefined
    const endDate: Date | undefined = undefined

    const testMockStoreState = {
      range: {
        from: startDate,
        to: endDate,
      },
      Adult: 1,
      Children: 1,
      Room: 2,
      setRange: vi.fn(),
      setAdult: vi.fn(),
      setChildren: vi.fn(),
      setRoom: vi.fn(),
    }

    const testMockCountryStoreState = {
      country: { uid: '', term: '', lat: 0, lng: 0 },
      setCountry: vi.fn(),
    }

    mockUseFormStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(testMockStoreState)
      }
      return testMockStoreState
    })

    mockUseCountryStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(testMockCountryStoreState)
      }
      return testMockCountryStoreState
    })

    render(<DestinationSearch />)

    await new Promise(resolve => setTimeout(resolve, 200))

    const startInput = document.querySelector('input[name="start_"]') as HTMLInputElement
    const endInput = document.querySelector('input[name="end_"]') as HTMLInputElement
    const countryInput = document.querySelector('input[name="country_"]') as HTMLInputElement

    if (startInput) {
      fireEvent.change(startInput, { target: { value: startDate } })
    }
    if (endInput) {
      fireEvent.change(endInput, { target: { value: endDate } })
    }
    if (countryInput) {
      fireEvent.change(countryInput, { target: { value: JSON.stringify(testMockCountryStoreState.country) } })
    }

    act(() => {
      fireEvent.click(screen.getByTestId('search-button'))
    })

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('please select a start date and an end date.'),
    )).toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('start date must be at least 3 days from today.'),
    )).not.toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('end date must be at least 1 day after the start date.'),
    )).not.toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('please enter a destination.'),
    )).toBeInTheDocument()
  })

  it('shows error when start date is not at least 3 days after today and country is empty', async () => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() + 2)
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000)

    const testMockStoreState = {
      range: {
        from: startDate,
        to: endDate,
      },
      Adult: 1,
      Children: 1,
      Room: 2,
      setRange: vi.fn(),
      setAdult: vi.fn(),
      setChildren: vi.fn(),
      setRoom: vi.fn(),
    }

    const testMockCountryStoreState = {
      country: { uid: '', term: '', lat: 0, lng: 0 },
      setCountry: vi.fn(),
    }

    mockUseFormStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(testMockStoreState)
      }
      return testMockStoreState
    })

    mockUseCountryStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(testMockCountryStoreState)
      }
      return testMockCountryStoreState
    })

    render(<DestinationSearch />)

    await new Promise(resolve => setTimeout(resolve, 200))

    const startInput = document.querySelector('input[name="start_"]') as HTMLInputElement
    const endInput = document.querySelector('input[name="end_"]') as HTMLInputElement
    const countryInput = document.querySelector('input[name="country_"]') as HTMLInputElement

    const start = startDate.toLocaleDateString('sv-SE')
    const end = endDate.toLocaleDateString('sv-SE')

    if (startInput) {
      fireEvent.change(startInput, { target: { value: start } })
    }
    if (endInput) {
      fireEvent.change(endInput, { target: { value: end } })
    }
    if (countryInput) {
      fireEvent.change(countryInput, { target: { value: JSON.stringify(testMockCountryStoreState.country) } })
    }

    act(() => {
      fireEvent.click(screen.getByTestId('search-button'))
    })

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please select a start date and an end date.'),
    )).not.toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('start date must be at least 3 days from today.'),
    )).toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('end date must be at least 1 day after the start date.'),
    )).not.toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('please enter a destination.'),
    )).toBeInTheDocument()
  })

  it('shows error when end date is not at least 1 day after start date and country is empty', async () => {
    const today = new Date()
    const startDate = new Date(today)
    const endDate = new Date(today)
    startDate.setDate(today.getDate() + 3)
    endDate.setDate(startDate.getDate())

    const testMockStoreState = {
      range: {
        from: startDate,
        to: endDate,
      },
      Adult: 1,
      Children: 1,
      Room: 2,
      setRange: vi.fn(),
      setAdult: vi.fn(),
      setChildren: vi.fn(),
      setRoom: vi.fn(),
    }

    const testMockCountryStoreState = {
      country: { uid: '', term: '', lat: 0, lng: 0 },
      setCountry: vi.fn(),
    }

    mockUseFormStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(testMockStoreState)
      }
      return testMockStoreState
    })

    mockUseCountryStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(testMockCountryStoreState)
      }
      return testMockCountryStoreState
    })

    render(<DestinationSearch />)

    await new Promise(resolve => setTimeout(resolve, 200))

    const startInput = document.querySelector('input[name="start_"]') as HTMLInputElement
    const endInput = document.querySelector('input[name="end_"]') as HTMLInputElement
    const countryInput = document.querySelector('input[name="country_"]') as HTMLInputElement

    const start = startDate.toLocaleDateString('sv-SE')
    const end = endDate.toLocaleDateString('sv-SE')

    if (startInput) {
      fireEvent.change(startInput, { target: { value: start } })
    }
    if (endInput) {
      fireEvent.change(endInput, { target: { value: end } })
    }
    if (countryInput) {
      fireEvent.change(countryInput, { target: { value: JSON.stringify(testMockCountryStoreState.country) } })
    }

    act(() => {
      fireEvent.click(screen.getByTestId('search-button'))
    })

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please select a start date and an end date.'),
    )).not.toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('start date must be at least 3 days from today.'),
    )).not.toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('end date must be at least 1 day after the start date.'),
    )).toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('please enter a destination.'),
    )).toBeInTheDocument()
  })

  it('shows error when start date is not at least 3 days after today, end date is not at least 1 day after start date, and country is empty', async () => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() + 2)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate())

    const testMockStoreState = {
      range: {
        from: startDate,
        to: endDate,
      },
      Adult: 1,
      Children: 1,
      Room: 2,
      setRange: vi.fn(),
      setAdult: vi.fn(),
      setChildren: vi.fn(),
      setRoom: vi.fn(),
    }

    const testMockCountryStoreState = {
      country: { uid: '', term: '', lat: 0, lng: 0 },
      setCountry: vi.fn(),
    }

    mockUseFormStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(testMockStoreState)
      }
      return testMockStoreState
    })

    mockUseCountryStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(testMockCountryStoreState)
      }
      return testMockCountryStoreState
    })

    render(<DestinationSearch />)

    await new Promise(resolve => setTimeout(resolve, 200))

    const startInput = document.querySelector('input[name="start_"]') as HTMLInputElement
    const endInput = document.querySelector('input[name="end_"]') as HTMLInputElement
    const countryInput = document.querySelector('input[name="country_"]') as HTMLInputElement

    const start = startDate.toLocaleDateString('sv-SE')
    const end = endDate.toLocaleDateString('sv-SE')

    if (startInput) {
      fireEvent.change(startInput, { target: { value: start } })
    }
    if (endInput) {
      fireEvent.change(endInput, { target: { value: end } })
    }
    if (countryInput) {
      fireEvent.change(countryInput, { target: { value: JSON.stringify(testMockCountryStoreState.country) } })
    }

    act(() => {
      fireEvent.click(screen.getByTestId('search-button'))
    })

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please select a start date and an end date.'),
    )).not.toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('start date must be at least 3 days from today.'),
    )).toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('end date must be at least 1 day after the start date.'),
    )).toBeInTheDocument()

    expect(await screen.findByText(content =>
      content.toLowerCase().includes('please enter a destination.'),
    )).toBeInTheDocument()
  })

  it('navigates to results page on valid submit', async () => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() + 3)
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000)

    const testMockStoreState = {
      range: {
        from: startDate,
        to: endDate,
      },
      Adult: 1,
      Children: 1,
      Room: 2,
      setRange: vi.fn(),
      setAdult: vi.fn(),
      setChildren: vi.fn(),
      setRoom: vi.fn(),
    }

    const testMockCountryStoreState = {
      country: { uid: 'A6Dz', term: 'Rome, Italy', lat: 41.895466, lng: 12.482324 },
      setCountry: vi.fn(),
    }

    mockUseFormStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(testMockStoreState)
      }
      return testMockStoreState
    })

    mockUseCountryStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(testMockCountryStoreState)
      }
      return testMockCountryStoreState
    })

    const start = startDate.toLocaleDateString('sv-SE')
    const end = endDate.toLocaleDateString('sv-SE')

    render(<DestinationSearch />)

    await new Promise(resolve => setTimeout(resolve, 200))

    const startInput = document.querySelector('input[name="start_"]') as HTMLInputElement
    const endInput = document.querySelector('input[name="end_"]') as HTMLInputElement
    const countryInput = document.querySelector('input[name="country_"]') as HTMLInputElement

    if (startInput) {
      fireEvent.change(startInput, { target: { value: start } })
    }
    if (endInput) {
      fireEvent.change(endInput, { target: { value: end } })
    }
    if (countryInput) {
      fireEvent.change(countryInput, { target: { value: JSON.stringify(testMockCountryStoreState.country) } })
    }

    act(() => {
      fireEvent.click(screen.getByTestId('search-button'))
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please select a start date and an end date.'),
    )).not.toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('start date must be at least 3 days from today.'),
    )).not.toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('end date must be at least 1 day after the start date.'),
    )).not.toBeInTheDocument()

    expect(screen.queryByText(content =>
      content.toLowerCase().includes('please enter a destination.'),
    )).not.toBeInTheDocument()

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining(`/results/A6Dz?checkin=${start}&checkout=${end}&lang=en_US&currency=SGD&country_code=SG&guests=2|2`),
    )
  })
})
