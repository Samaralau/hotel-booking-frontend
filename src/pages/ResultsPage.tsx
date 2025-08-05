import { useParams, Link } from 'wouter'
import { useSearchParams } from '../hooks/useSearchParams'
import { BookingDetails } from '../components/ui/BookingDetails'
import { HotelCard } from '../components/ui/ResultsCard'
import { NavBar } from '../components/layout/NavBar'
import { useEffect, useMemo, useState } from 'react'
import type {
  StitchedHotel,
  PriceAPIResponse,
  Hotel,
  PriceInfo,
} from '../types/params'
import Sortdropdown from '../components/ui/SortDropDown'
// import FilterCheckBox from "../components/ui/FilterCheckBox";
import useSWR from 'swr'
import { BACKEND_URL } from '../config/api'
import { MapSelect } from '../components/ui/MapSelect'
import StarRatingFilter from '../components/ui/FilterStar'
import RangeSlider from '../components/ui/FilterPrice'
import DestinationSearch from '../components/ui/DestinationSearch'

const fetcher = (url: string) => fetch(url).then(response => response.json())

export const ResultsPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const destinationId = params.destination_id
  const checkin = searchParams.checkin ?? undefined
  const checkout = searchParams.checkout ?? undefined
  const guests = searchParams.guests ?? undefined

  const priceAPI = `${BACKEND_URL}/hotels/prices?destination_id=${destinationId}&checkin=${checkin}&checkout=${checkout}&guests=${guests}`
  const hotelAPI = `${BACKEND_URL}/hotels?destination_id=${destinationId}`

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

  // filter price range
  function getpricerange(data: StitchedHotel[]): [number, number] {
    const hotelprice = data.map(hotel => hotel.price ?? 0)
    const minprice = Math.min(...hotelprice)
    const maxprice = Math.max(...hotelprice)
    return [minprice, maxprice]
  }
  const [fullpricerange, setfullpricerange] = useState<[number, number]>([
    0, 1000,
  ])
  const [pricerange, setpricerange] = useState<[number, number]>([0, 1000])

  useEffect(() => {
    if (stichedata.length > 0) {
      const [minprice, maxprice] = getpricerange(stichedata)
      setfullpricerange([minprice, maxprice])
      setpricerange([minprice, maxprice])
    }
    else {
      setfullpricerange([0, 0])
      setpricerange([0, 0])
    }
  }, [stichedata])

  // filter stars range
  const [minstar, setminstar] = useState(0.5)
  const [maxstar, setmaxstar] = useState(5)

  // filter star and price
  const filteredlist: StitchedHotel[] = useMemo(() => {
    return stichedata.filter((hotel) => {
      const starRange = hotel.rating >= minstar && hotel.rating <= maxstar
      const priceRange
        = hotel.price !== undefined
          && hotel.price >= pricerange[0]
          && hotel.price <= pricerange[1]
      return starRange && priceRange
    })
  }, [stichedata, minstar, maxstar, pricerange])

  // sort for dropdown
  const [sortby, setsortby] = useState('Price (Ascending)')
  const sortedlist: StitchedHotel[] = useMemo(() => {
    const datacopy = [...filteredlist]
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
  }, [filteredlist, sortby])

  // pagination
  const [show, setshow] = useState(1)
  useEffect(() => {
    setshow(1)
  }, [stichedata, minstar, maxstar, pricerange])
  const shownlist = useMemo(
    () => sortedlist.slice(0, show * 10),
    [sortedlist, show],
  )

  const isloading
    = priceloading || hotelloading || pricedata?.completed !== true

  const pageTitle = `Search Results for ${destinationId}`
  return (
    <>
      <NavBar pageTitle={pageTitle} />
      <div className="py-2">
        <DestinationSearch />
      </div>
      <BookingDetails
        searchParams={searchParams}
        destinationId={destinationId}
      />

      <div className="mb-3">
        <h2 className="text-2xl font-semibold mb-2">Hotel Search Results</h2>
        <div className="pt-8"></div>

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
          <div>
            <span>
              Please wait a moment as we fetch the best prices for you...
            </span>
            <div className={isloading ? 'mt-16' : 'mt-8'}>
              <div className="card card-side bg-base-100 shadow-sm dark:shadow-xl">
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
          </div>
        )
        : (
          <>
            <div className="flex items-center justify-between mb-5">
              <span className="text-lg text-base-content/70">
                Last updated:
                {' '}
                {new Date().toLocaleString()}
              </span>
              <div className="flex justify-end">
                <Sortdropdown selectedvalue={sortby} setvalue={setsortby} />
              </div>
            </div>

            <div className="flex gap-10 pt-5">
              <aside className="w-70 shrink-0">
                <div className="pb-5 ">
                  <MapSelect
                    hotels={shownlist}
                    checkin={checkin}
                    checkout={checkout}
                    guests={guests}
                    destinationId={destinationId}
                  />
                </div>

                <div className="flex flex-col items-center rounded-lg h-50 border-4 border-double pr-3 pt-3">
                  <h2 className="text-lg font-semibold flex pb-2 ">
                    {' '}
                    Filter By:
                  </h2>
                  <hr className="border-t border-gray-300 mb-3 w-50" />
                  <StarRatingFilter
                    minstar={minstar}
                    maxstar={maxstar}
                    setminstar={setminstar}
                    setmaxstar={setmaxstar}
                  >
                  </StarRatingFilter>
                  <div className="pt-6 pl-2">
                    <RangeSlider
                      minprice={fullpricerange[0]}
                      maxprice={fullpricerange[1]}
                      value={pricerange}
                      onChange={setpricerange}
                    >
                    </RangeSlider>
                  </div>
                </div>
              </aside>

              <div className="space-y-5 flex-1">
                {sortedlist.length === 0
                  ? (
                    <div className="flex justify-center">
                      <span className="text-yellow-700 bg-gray-700">
                        No matching hotels found. Please try a different criteria!
                      </span>
                    </div>
                  )
                  : (
                    <>
                      {shownlist.map((hotel: StitchedHotel) => (
                        <HotelCard
                          key={hotel.id}
                          hotel={hotel}
                          hotelprice={hotel.price}
                          checkin={checkin}
                          checkout={checkout}
                          guests={guests}
                          destinationId={destinationId}
                        />
                      ))}
                      {shownlist.length < sortedlist.length && (
                        <button
                          className="btn btn-primary mt-4"
                          onClick={() => setshow(show => show + 1)}
                        >
                          Load More
                        </button>
                      )}
                    </>
                  )}
              </div>
            </div>
          </>
        )}
      <div className="pt-17">
        <Link
          href="/hotels/detail/atH8?destination_id=WD0M&checkin=2025-10-01&checkout=2025-10-07&lang=en_US&currency=SGD&country_code=SG&guests=2|2"
          className="btn btn-secondary mr-4"
        >
          View Hotel Details
        </Link>
        <Link href="/" className="btn btn-outline">
          Back to Home
        </Link>
      </div>
    </>
  )
}
