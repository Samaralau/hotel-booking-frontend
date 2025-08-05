import StarUI from './StarRating'

type FilterStarprops = {
  minstar: number
  maxstar: number
  setminstar: (val: number) => void
  setmaxstar: (val: number) => void
}

export default function StarRatingFilter({
  minstar,
  maxstar,
  setminstar,
  setmaxstar,
}: FilterStarprops) {
  return (
    <div className="flex flex-row gap-4">
      <div>
        <p className="font-bold text-lg flex justify-center">Min Rating</p>
        <StarUI
          name="min-rating"
          rating={minstar}
          onChange={val => setminstar(val)}
          readonly={false}
        />
      </div>
      <div>
        <p className="font-bold text-lg flex justify-center">Max Rating</p>
        <StarUI
          name="max-rating"
          rating={maxstar}
          onChange={val => setmaxstar(val)}
          readonly={false}
        />
      </div>
    </div>
  )
}
