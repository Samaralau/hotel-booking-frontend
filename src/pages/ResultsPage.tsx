import { useParams, Link } from 'wouter'
import { useSearchParams } from '../hooks/useSearchParams'
import { BookingDetails } from '../components/ui/BookingDetails'
import { HotelCard } from '../components/ui/ResultsCard'
import { useMemo, useState } from 'react'
import type {
  StitchedHotel,
  PriceAPIResponse,
  Hotel,
  PriceInfo,
} from '../types/params'
import Sortdropdown from '../components/ui/SortDropDown'
import useSWR from 'swr'
import StarRatingFilter from '../components/ui/FilterStar'
// import { BACKEND_URL } from "../config/api";

const baseURL = import.meta.env.VITE_BACKEND_URL

const fetcher = (url: string) => fetch(url).then(response => response.json())

export const ResultsPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const destinationId = params.destination_id
  const checkin = searchParams.checkin ?? undefined
  const checkout = searchParams.checkout ?? undefined
  const guests = searchParams.guests ?? undefined

  const priceAPI = `${baseURL}/hotels/prices?destination_id=${destinationId}&checkin=${checkin}&checkout=${checkout}&guests=${guests}`
  const hotelAPI = `${baseURL}/hotels?destination_id=${destinationId}`

  const {
    data: pricedata,
    error: priceerror,
    isLoading: priceloading,
  } = useSWR<PriceAPIResponse, Error>(priceAPI, fetcher, {
    refreshInterval: (data) => {
      // Revalidate every 5 seconds if search is not completed
      return data?.completed === true ? 0 : 5000
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  const {
    data: hoteldata,
    error: hotelerror,
    isLoading: hotelloading,
  } = useSWR<Hotel[], Error>(hotelAPI, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  const stichedata = useMemo(() => {
    if (hoteldata && pricedata?.hotels) {
      return hoteldata
        .map((hotel: Hotel) => {
          const priceinfo = pricedata.hotels.find(
            (price: PriceInfo) => price.id === hotel.id,
          )
          return {
            ...hotel,
            price: priceinfo?.price,
            searchRank: priceinfo?.searchRank,
          }
        })
        .filter((hotel: StitchedHotel) => hotel.price !== undefined)
        .sort((a: StitchedHotel, b: StitchedHotel) => a.price! - b.price!)
    }
    return []
  }, [hoteldata, pricedata])

  const isloading
    = priceloading || hotelloading || pricedata?.completed !== true

  // filter stars range
  const [minstar, setminstar] = useState(0.5)
  const [maxstar, setmaxstar] = useState(5)
  const starfilterlist: StitchedHotel[] = useMemo(() => {
    if (maxstar >= minstar) {
      return stichedata.filter(
        hotel => hotel.rating >= minstar && hotel.rating <= maxstar,
      )
    }
    else {
      return []
    }
  }, [stichedata, minstar, maxstar])
  // sort for dropdown
  const [sortby, setsortby] = useState('Price (Ascending)')
  const sortedlist: StitchedHotel[] = useMemo(() => {
    const datacopy = [...starfilterlist]
    if (sortby === 'Price (Ascending)') {
      datacopy.sort(
        (a: StitchedHotel, b: StitchedHotel) => a.price! - b.price!,
      )
    }
    else if (sortby === 'Price (Descending)') {
      datacopy.sort(
        (a: StitchedHotel, b: StitchedHotel) => b.price! - a.price!,
      )
    }
    else if (sortby === 'Rating (Ascending)') {
      datacopy.sort(
        (a: StitchedHotel, b: StitchedHotel) => a.rating - b.rating,
      )
    }
    else if (sortby === 'Rating (Descending)') {
      datacopy.sort(
        (a: StitchedHotel, b: StitchedHotel) => b.rating - a.rating,
      )
    }
    return datacopy
  }, [starfilterlist, sortby])

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">
        Search Results for
        {' '}
        {destinationId}
      </h1>

      <BookingDetails
        searchParams={searchParams}
        destinationId={destinationId}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Hotel Search Results</h2>
        {isloading && (
          <span>
            Please wait a moment as we fetch the best prices for you...
          </span>
        )}

        {hotelerror && (
          <div className="text-red-800 bg-yellow-400">
            <span>
              Error loading hotel data:
              {hotelerror.message}
            </span>
          </div>
        )}

        {priceerror && (
          <div className="text-red-800 bg-yellow-400">
            <span>
              Error loading price data:
              {priceerror.message}
            </span>
          </div>
        )}
      </div>

      {isloading
        ? (
          <div className={priceloading && hotelloading ? 'mt-16' : 'mt-8'}>
            <div className="card card-side bg-base-100 shadow-sm">
              <figure className="p-10">
                <div className="skeleton h-48 w-48 shrink-0 rounded-xl"></div>
              </figure>
              <div className="card-body py-12">
                <div className="flex-1">
                  <div className="skeleton h-6 w-48"></div>
                  <div className="flex flex-wrap mt-4 gap-4">
                    <div className="skeleton h-6 w-20 rounded-full"></div>
                    <div className="skeleton h-6 w-20 rounded-full"></div>
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <div className="skeleton h-12 w-20 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        )
        : (
          <>
            <div className="flex  justify-between mb-5">
              <span className="text-lg text-base-content/70">
                Last updated:
                {' '}
                {new Date().toLocaleString()}
              </span>
              <div className="flex justify-end">
                <Sortdropdown selectedvalue={sortby} setvalue={setsortby} />
              </div>
            </div>

            <div className="flex gap-15 pt-5">
              <aside className="rounded-lg wrap-content h-50 border-4 border-double pr-3 pt-3  ">
                <div className="pl-3">
                  <h2 className="text-lg font-semibold flex justify-centre pb-2 ">
                    {' '}
                    Filter By:
                  </h2>
                  <hr className="border-t border-gray-300 mb-3" />
                  <StarRatingFilter
                    minstar={minstar}
                    maxstar={maxstar}
                    setminstar={setminstar}
                    setmaxstar={setmaxstar}
                  >
                  </StarRatingFilter>
                </div>
              </aside>

              <div className="space-y-5">
                {isloading
                  ? null
                  : sortedlist.length > 0
                    ? (
                      <>
                        {sortedlist.map((hotel: StitchedHotel) => (
                          <HotelCard
                            key={hotel.id}
                            hotel={hotel}
                            hotelprice={hotel.price}
                            checkin={checkin}
                            checkout={checkout}
                            guests={guests}
                          />
                        ))}
                      </>
                    )
                    : (
                      <p className="content-center text-yellow-700 bg-gray-700">
                        No matching hotels found. Please try a different criteria!
                      </p>
                    )}
              </div>
            </div>
          </>
        )}

      <div className="pt-17">
        <Link href="/" className="btn btn-outline">
          Back to Home
        </Link>
      </div>
    </>
  )
}
