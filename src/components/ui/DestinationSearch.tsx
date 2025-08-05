import { useEffect } from 'react'
import DropDownWithButtons from './DropDown'
// import { MyAccountDropdown } from "../components/ui/MyAccount";
import { type Destination } from '../../types/destination'
import DayPicker from './DayPicker'
import { type Country } from '../../types/forms'
import { useFormStore, useCountryStore } from '../../store'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useLocation } from 'wouter'
import { TypeaheadSearch } from './TypeaheadSearch'

export default function DestinationSearch(): React.ReactElement {
  const range = useFormStore(s => s.range)
  const Adult = useFormStore(s => s.Adult)
  const Child = useFormStore(s => s.Children)
  const Room = useFormStore(s => s.Room)
  const { country, setCountry } = useCountryStore()

  const from = range?.from
  const to = range?.to
  const start = from?.toLocaleDateString('sv-SE')
  const end = to?.toLocaleDateString('sv-SE')
  const sum = Adult + Child

  const handleDestinationSelect = (destination: Destination) => {
    setCountry(
      destination.uid,
      destination.term,
      destination.lat,
      destination.lng,
    )
    console.log('Selected destination:', destination)
  }

  type FormValues = {
    start_?: string
    end_?: string
    sum_?: number
    Room_?: number
    country_?: Country
  }

  const [, navigate] = useLocation()

  const {
    register,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      start_: start,
      end_: end,
      sum_: sum,
      Room_: Room,
      country_: country,
    },
    mode: 'onSubmit',
  })

  useEffect(() => {
    setValue('start_', start)
    setValue('end_', end)
    setValue('sum_', sum)
    setValue('Room_', Room)
    setValue('country_', country)
  }, [start, end, sum, Room, country, setValue])

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    let hasError = false
    if (data.start_ == undefined || data.end_ == undefined) {
      setError('root', {
        type: 'manual',
        message: 'Please select a start date and an end date.',
      })
      hasError = true
    }
    else {
      clearErrors('root')
    }

    const today: Date = new Date()
    const minStartDate: Date = new Date()
    minStartDate.setDate(today.getDate() + 3)
    const minEndDate = from
      ? new Date(from.getTime() + 24 * 60 * 60 * 1000)
      : new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)
    if (data.start_ && data.start_ < minStartDate.toLocaleDateString('sv-SE')) {
      setError('start_', {
        type: 'manual',
        message: 'Start date must be at least 3 days from today.',
      })
      hasError = true
    }
    else {
      clearErrors('start_')
    }

    if (data.end_ && data.end_ < minEndDate.toLocaleDateString('sv-SE')) {
      setError('end_', {
        type: 'manual',
        message: 'End date must be at least 1 day after the start date.',
      })
      console.log('End date:', data.end_)
      hasError = true
    }
    else {
      clearErrors('end_')
    }

    if (data.country_?.uid == '') {
      setError('country_', {
        type: 'manual',
        message: 'Please enter a destination.',
      })
      hasError = true
    }
    else {
      clearErrors('country_')
    }

    if (hasError) return

    navigate(
      `/results/${country.uid}?checkin=${start}&checkout=${end}&lang=en_US&currency=SGD&country_code=SG&guests=${Array(Room).fill(sum).join('|')}`,
    )
  }
  return (
    <>
      <div className="w-full border border-gray-400 rounded-lg p-4 shadow-md">
        <DropDownWithButtons></DropDownWithButtons>
        <div className="flex flex-col sm:flex-row flex-wrap gap-8 py-4 w-full">
          <TypeaheadSearch
            onSelect={handleDestinationSelect}
            placeholder="Search destinations..."
            className="w-full md:w-[70%] min-w-[300px]"
            limit={5}
            threshold={0.3}
          />
          <DayPicker></DayPicker>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e)
            }}
            className="space-y-4"
          >
            <div>
              <input
                type="hidden"
                {...register('country_', {
                  required: 'Please enter a destination.',
                })}
              />
              <input type="hidden" {...register('start_')} />
              <input type="hidden" {...register('end_')} />
            </div>
            {errors.root && (
              <p className="text-red-500">{errors.root.message}</p>
            )}
            {errors.start_ && (
              <p className="text-red-500">{errors.start_.message}</p>
            )}
            {errors.end_ && (
              <p className="text-red-500">{errors.end_.message}</p>
            )}
            {errors.country_ && (
              <p className="text-red-500">{errors.country_.message}</p>
            )}
            <button
              type="submit"
              className="btn btn-primary mt-2"
              data-testid="search-button"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
