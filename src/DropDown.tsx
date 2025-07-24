import { useState } from 'react'
import { useFormStore } from './store'

const incrementBy = (setFn: (val: number | ((prev: number) => number)) => void, amount: number) => {
  setFn((prev) => {
    if (prev < 5) {
      return prev + amount
    }
    else {
      return prev
    }
  })
}

const decrementBy = (setFn: (val: number | ((prev: number) => number)) => void, amount: number) => {
  setFn((prev) => {
    if (prev > 0) {
      return prev - amount
    }
    else {
      return prev
    }
  })
}

export default function DropdownWithButtons() {
  const [isOpen, setIsOpen] = useState(false)

  const Adult = useFormStore(s => s.Adult)
  const Child = useFormStore(s => s.Children)
  const Room = useFormStore(s => s.Room)
  const setAdult = useFormStore(s => s.setAdult)
  const setChild = useFormStore(s => s.setChildren)
  const setRoom = useFormStore(s => s.setRoom)

  const sum = Adult + Child

  function CheckAdultAndChildren() {
    let str: string
    if (sum > 1) {
      str = 'Guests'
    }
    else {
      str = 'Guest'
    }
    return str
  };

  function CheckRoom() {
    let str: string
    if (Room > 1) {
      str = 'Rooms'
    }
    else {
      str = 'Room'
    }
    return str
  };

  return (
    <div className="relative inline-block">
      <button onClick={() => setIsOpen(!isOpen)}>
        {sum}
        {' '}
        <CheckAdultAndChildren></CheckAdultAndChildren>
        {' '}
        |
        {' '}
        {Room}
        {' '}
        <CheckRoom></CheckRoom>
        {' '}
        ▼
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 bg-white border border-gray-300 shadow-md z-[1000] min-w-[150px]">
          <div className="flex gap-5 items-center justify-between">
            <div className="flex gap-2 items-center">
              <p>Adults</p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                className="block w-full p-2"
                onClick={() => {
                  decrementBy(setAdult, 1)
                }}
              >
                -
              </button>
              <p>
                {' '}
                {Adult}
              </p>
              {' '}
              {}
              <button
                className="block w-full p-2"
                onClick={() => {
                  incrementBy(setAdult, 1)
                }}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-5 items-center justify-between">
            <div className="flex gap-2 items-center">
              <p>Children</p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                className="block w-full p-2"
                onClick={() => {
                  decrementBy(setChild, 1)
                }}
              >
                -
              </button>
              <p>
                {' '}
                {Child}
              </p>
              {' '}
              {}
              <button
                className="block w-full p-2"
                onClick={() => {
                  incrementBy(setChild, 1)
                }}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-5 items-center justify-between">
            <div className="flex gap-2 items-center">
              <p>Rooms</p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                className="block w-full p-2"
                onClick={() => {
                  decrementBy(setRoom, 1)
                }}
              >
                -
              </button>
              <p>
                {' '}
                {Room}
              </p>
              {' '}
              {}
              <button
                className="block w-full p-2"
                onClick={() => {
                  incrementBy(setRoom, 1)
                }}
              >
                +
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
