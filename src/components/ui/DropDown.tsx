import { useFormStore } from '../../store'
import { incrementBy, decrementBy, CheckAdultAndChildren, CheckRoom } from '../../utils/dropdownUtils'

export default function DropDownWithButtons() {
  const Adult = useFormStore(s => s.Adult)
  const Child = useFormStore(s => s.Children)
  const Room = useFormStore(s => s.Room)
  const setAdult = useFormStore(s => s.setAdult)
  const setChild = useFormStore(s => s.setChildren)
  const setRoom = useFormStore(s => s.setRoom)

  const sum = Adult + Child
  const adultAndChildren = CheckAdultAndChildren(sum)
  const room = CheckRoom(Room)

  return (
    <div>
      <button
        popoverTarget="popover-1"
        style={{ anchorName: '--anchor-1' } as React.CSSProperties}
        className="relative border rounded-lg border-gray-300 flex w-65 h-fit items-center justify-center p-2 font-bold"
        data-testid="main-dropdown-button"
      >
        {sum}
        {' '}
        {adultAndChildren}
        {' '}
        |
        {' '}
        {Room}
        {' '}
        {room}
        {' '}
        ▼
      </button>

      <div
        popover="auto"
        id="popover-1"
        className="dropdown mt-2 z-50 bg-base-100 border w-65 shadow-lg"
        style={{ positionAnchor: '--anchor-1' } as React.CSSProperties}
        role="dropdown"
      >
        <div className="flex gap-5 items-center justify-between px-2">
          <div className="flex gap-2 items-center">
            <strong>Adults</strong>
          </div>
          <div className="flex gap-2 items-center">
            <button
              data-testid="adult-decrement-button"
              className="block w-full p-2"
              onClick={() => {
                decrementBy(setAdult, 1, sum)
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
              data-testid="adult-increment-button"
              className="block w-full p-2"
              onClick={() => {
                incrementBy(setAdult, 1)
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex gap-5 items-center justify-between px-2">
          <div className="flex gap-2 items-center">
            <strong>Children</strong>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              data-testid="child-decrement-button"
              className="block w-full p-2"
              onClick={() => {
                decrementBy(setChild, 1, sum)
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
              data-testid="child-increment-button"
              className="block w-full p-2"
              onClick={() => {
                incrementBy(setChild, 1)
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex gap-5 items-center justify-between px-2">
          <div className="flex gap-2 items-center">
            <strong>Rooms</strong>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              data-testid="room-decrement-button"
              className="block w-full p-2"
              onClick={() => {
                decrementBy(setRoom, 1, Room)
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
              data-testid="room-increment-button"
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
    </div>
  )
}
