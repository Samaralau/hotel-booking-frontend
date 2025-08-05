import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, vi, expect, test } from 'vitest'
import { incrementBy, decrementBy, CheckAdultAndChildren, CheckRoom } from '../src/utils/dropdownUtils'
import DropDownWithButtons from '../src/components/ui/DropDown'
import { useFormStore } from '../src/store'

function createMockState<T>(initialValue: T) {
  let value = initialValue

  const setter = vi.fn((update: T | ((prev: T) => T)) => {
    value
      = typeof update === 'function'
        ? (update as (prev: T) => T)(value)
        : update
  })

  const getValue = () => value

  return { setter, getValue }
}

describe('incrementBy Unit Test', () => {
  it('incrementBy should increase the value by the given amount if the result is less than or equal to 4', () => {
    const { setter, getValue } = createMockState(1)
    const incrementAmount = 3
    incrementBy(setter, incrementAmount)
    expect(setter).toHaveBeenCalled()
    expect(getValue()).toBe(4)
  })
})

describe('incrementBy Unit Test', () => {
  it('incrementBy should not increase the value by the given amount if the result is more than 4', () => {
    const { setter, getValue } = createMockState(4)
    const incrementAmount = 1
    incrementBy(setter, incrementAmount)
    expect(setter).toHaveBeenCalled()
    expect(getValue()).toBe(4)
  })
})

describe('decrementBy Unit Test', () => {
  it('decrementBy should decrease the value by the given amount if the result is greater than or equal to 1 and sum is less than or equal to 1', () => {
    const { setter, getValue } = createMockState(4)
    const decrementAmount = 2
    const sum = 1
    decrementBy(setter, decrementAmount, sum)
    expect(setter).toHaveBeenCalled()
    expect(getValue()).toBe(2)
  })
})

describe('decrementBy Unit Test', () => {
  it('decrementBy should not decrease the value by the given amount if the result is less than 1 and the sum is less than or equal to 1', () => {
    const { setter, getValue } = createMockState(1)
    const decrementAmount = 1
    const sum = 1
    decrementBy(setter, decrementAmount, sum)
    expect(setter).toHaveBeenCalled()
    expect(getValue()).toBe(1)
  })
})

describe('decrementBy Unit Test', () => {
  it('decrementBy should decrease the value by the given amount if the result is greater than or equal to 0 and sum is more than 1', () => {
    const { setter, getValue } = createMockState(4)
    const decrementAmount = 4
    const sum = 6
    decrementBy(setter, decrementAmount, sum)
    expect(setter).toHaveBeenCalled()
    expect(getValue()).toBe(0)
  })
})

describe('decrementBy Unit Test', () => {
  it('decrementBy should not decrease the value by the given amount if the result is less than 0 and the sum is more than 1', () => {
    const { setter, getValue } = createMockState(5)
    const decrementAmount = 6
    const sum = 2
    decrementBy(setter, decrementAmount, sum)
    expect(setter).toHaveBeenCalled()
    expect(getValue()).toBe(5)
  })
})

test('CheckAdultAndChildren should return Guests per room if input is more than 1', () => {
  const adults = 2
  const children = 1
  const result = CheckAdultAndChildren(adults + children)
  expect(result).toBe('Guests per room')
})

test('CheckAdultAndChildren should return Guest per room if input is equal to 1', () => {
  const adults = 0
  const children = 1
  const result = CheckAdultAndChildren(adults + children)
  expect(result).toBe('Guest per room')
})

test('CheckAdultAndChildren should throw an error if input is not a positive number', () => {
  expect(() => CheckAdultAndChildren(0)).toThrow('Input must be a positive number')
})

test('CheckRoom should return Rooms if input is more than 1', () => {
  const rooms = 3
  const result = CheckRoom(rooms)
  expect(result).toBe('Rooms')
})

test('CheckRoom should return Room if input is equal to 1', () => {
  const rooms = 1
  const result = CheckRoom(rooms)
  expect(result).toBe('Room')
})

test('CheckRoom should throw an error if input is not positive', () => {
  expect(() => CheckRoom(0)).toThrow('Input must be a positive number')
})

vi.mock('../src/store', () => {
  return {
    useFormStore: vi.fn(),
  }
})

const mockUseFormStore = vi.mocked(useFormStore)

describe('Integration Test for DropDownWithButtons', () => {
  let mockStoreState = {
    Adult: 1,
    Children: 0,
    Room: 1,
    setAdult: vi.fn(),
    setChildren: vi.fn(),
    setRoom: vi.fn(),
    range: { from: undefined, to: undefined },
    setRange: vi.fn(),
  }
  beforeEach(() => {
    vi.clearAllMocks()

    mockStoreState = {
      Adult: 1,
      Children: 0,
      Room: 1,
      setAdult: vi.fn(),
      setChildren: vi.fn(),
      setRoom: vi.fn(),
      range: { from: undefined, to: undefined },
      setRange: vi.fn(),
    }

    mockUseFormStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStoreState)
      }
      return mockStoreState
    })
  })

  it('renders the main dropdown button with initial values', () => {
    render(<DropDownWithButtons />)

    const mainButton = screen.getByTestId('main-dropdown-button')
    expect(mainButton).toBeInTheDocument()
    expect(mainButton).toHaveTextContent('1 Guest per room | 1 Room ▼')
  })

  it('opens the popover when the main button is clicked', () => {
    render(<DropDownWithButtons />)

    const mainButton = screen.getByTestId('main-dropdown-button')
    fireEvent.click(mainButton)

    const popover = screen.getByRole('dropdown', { hidden: false })
    expect(popover).toBeVisible()
  })

  it('increments adult count when "+" button is clicked', () => {
    render(<DropDownWithButtons />)

    // Open the popover first
    fireEvent.click(screen.getByTestId('main-dropdown-button'))

    const incrementAdultsButton = screen.getByTestId('adult-increment-button')
    fireEvent.click(incrementAdultsButton)

    expect(mockStoreState.setAdult).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setAdult.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Adult)
    expect(newValue).toBe(2)
  })

  it('does not increment adult count when "+" button is clicked if adult count is 4', () => {
    mockStoreState.Adult = 4
    render(<DropDownWithButtons />)

    fireEvent.click(screen.getByTestId('main-dropdown-button'))

    const incrementAdultsButton = screen.getByTestId('adult-increment-button')
    fireEvent.click(incrementAdultsButton)

    expect(mockStoreState.setAdult).toHaveBeenCalledTimes(1)

    const setterFn = mockStoreState.setAdult.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Adult)
    expect(newValue).toBe(4)
  })

  it('decrements adult count when "-" button is clicked (and does not go below one)', () => {
    mockStoreState.Adult = 2
    render(<DropDownWithButtons />)

    fireEvent.click(screen.getByTestId('main-dropdown-button'))

    const decrementAdultsButton = screen.getByTestId('adult-decrement-button')
    fireEvent.click(decrementAdultsButton)

    expect(mockStoreState.setAdult).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setAdult.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Adult)
    expect(newValue).toBe(1)
  })

  it('does not decrement adult count when "-" button is clicked if adult count is 1 and sum is less than equals to 1', () => {
    mockStoreState.Adult = 1
    mockStoreState.Children = 0
    render(<DropDownWithButtons />)

    fireEvent.click(screen.getByTestId('main-dropdown-button'))

    const decrementAdultsButton = screen.getByTestId('adult-decrement-button')
    fireEvent.click(decrementAdultsButton)

    expect(mockStoreState.setAdult).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setAdult.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Adult)
    expect(newValue).toBe(1)
  })

  it('decrements adult count when "-" button is clicked if adult count is 1 and sum is more than 1', () => {
    mockStoreState.Adult = 1
    mockStoreState.Children = 1
    render(<DropDownWithButtons />)

    fireEvent.click(screen.getByTestId('main-dropdown-button'))

    const decrementAdultsButton = screen.getByTestId('adult-decrement-button')
    fireEvent.click(decrementAdultsButton)

    expect(mockStoreState.setAdult).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setAdult.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Adult)
    expect(newValue).toBe(0)
  })

  it('does not decrement adult count when "-" button is clicked if adult count is 0 and sum is more than 1', () => {
    mockStoreState.Adult = 0
    mockStoreState.Children = 2
    render(<DropDownWithButtons />)

    fireEvent.click(screen.getByTestId('main-dropdown-button'))

    const decrementAdultsButton = screen.getByTestId('adult-decrement-button')
    fireEvent.click(decrementAdultsButton)

    expect(mockStoreState.setAdult).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setAdult.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Adult)
    expect(newValue).toBe(0)
  })

  it('increments children count when "+" button is clicked', () => {
    render(<DropDownWithButtons />)
    fireEvent.click(screen.getByTestId('main-dropdown-button'))
    const incrementChildrenButton = screen.getByTestId('child-increment-button')
    fireEvent.click(incrementChildrenButton)
    expect(mockStoreState.setChildren).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setChildren.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Children)
    expect(newValue).toBe(1)
  })

  it('does not increment children count when "+" button is clicked if children count is 4', () => {
    mockStoreState.Children = 4
    render(<DropDownWithButtons />)
    fireEvent.click(screen.getByTestId('main-dropdown-button'))
    const incrementChildrenButton = screen.getByTestId('child-increment-button')
    fireEvent.click(incrementChildrenButton)
    expect(mockStoreState.setChildren).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setChildren.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Children)
    expect(newValue).toBe(4)
  })

  it('decrements children count when "-" button is clicked (and does not go below zero)', () => {
    mockStoreState.Children = 1
    render(<DropDownWithButtons />)

    fireEvent.click(screen.getByTestId('main-dropdown-button'))

    const decrementChildrenButton = screen.getByTestId('child-decrement-button')
    fireEvent.click(decrementChildrenButton)

    expect(mockStoreState.setChildren).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setChildren.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Children)
    expect(newValue).toBe(0)
  })

  it('does not decrement children count when "-" button is clicked if children count is 1 and sum is less than equals to one', () => {
    mockStoreState.Children = 1
    mockStoreState.Adult = 0
    render(<DropDownWithButtons />)

    fireEvent.click(screen.getByTestId('main-dropdown-button'))

    const decrementChildrenButton = screen.getByTestId('child-decrement-button')
    fireEvent.click(decrementChildrenButton)

    expect(mockStoreState.setChildren).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setChildren.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Children)
    expect(newValue).toBe(1)
  })

  it('decrements children count when "-" button is clicked if children count is 1 and sum is more than 1', () => {
    mockStoreState.Children = 1
    mockStoreState.Adult = 1
    render(<DropDownWithButtons />)
    fireEvent.click(screen.getByTestId('main-dropdown-button'))
    const decrementChildrenButton = screen.getByTestId('child-decrement-button')
    fireEvent.click(decrementChildrenButton)

    expect(mockStoreState.setChildren).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setChildren.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Children)
    expect(newValue).toBe(0)
  })

  it('does not decrement children count when "-" button is clicked if children count is 0 and sum is more than 1', () => {
    mockStoreState.Children = 0
    mockStoreState.Adult = 2
    render(<DropDownWithButtons />)

    fireEvent.click(screen.getByTestId('main-dropdown-button'))

    const decrementChildrenButton = screen.getByTestId('child-decrement-button')
    fireEvent.click(decrementChildrenButton)

    expect(mockStoreState.setChildren).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setChildren.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Children)
    expect(newValue).toBe(0)
  })

  it('increments rooms count when "+" button is clicked', () => {
    render(<DropDownWithButtons />)
    fireEvent.click(screen.getByTestId('main-dropdown-button'))
    const incrementRoomsButton = screen.getByTestId('room-increment-button')
    fireEvent.click(incrementRoomsButton)
    expect(mockStoreState.setRoom).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setRoom.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Room)
    expect(newValue).toBe(2)
  })

  it('does not increment rooms count when "+" button is clicked if room count is 4', () => {
    mockStoreState.Room = 4
    render(<DropDownWithButtons />)

    fireEvent.click(screen.getByTestId('main-dropdown-button'))

    const incrementRoomsButton = screen.getByTestId('room-increment-button')
    fireEvent.click(incrementRoomsButton)

    expect(mockStoreState.setRoom).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setRoom.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Room)
    expect(newValue).toBe(4)
  })

  it('decrements room count when "-" button is clicked if room count is more than 1)', () => {
    mockStoreState.Room = 2
    render(<DropDownWithButtons />)

    fireEvent.click(screen.getByTestId('main-dropdown-button'))

    const decrementRoomsButton = screen.getByTestId('room-decrement-button')
    fireEvent.click(decrementRoomsButton)

    expect(mockStoreState.setRoom).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setRoom.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Room)
    expect(newValue).toBe(1)
  })

  it('does not decrement room count when "-" button is clicked if room count is 1', () => {
    mockStoreState.Room = 1
    render(<DropDownWithButtons />)

    fireEvent.click(screen.getByTestId('main-dropdown-button'))

    const decrementRoomsButton = screen.getByTestId('room-decrement-button')
    fireEvent.click(decrementRoomsButton)

    expect(mockStoreState.setRoom).toHaveBeenCalledTimes(1)
    const setterFn = mockStoreState.setRoom.mock.calls[0][0] as (prev: number) => number
    const newValue = setterFn(mockStoreState.Room)
    expect(newValue).toBe(1)
  })
})
