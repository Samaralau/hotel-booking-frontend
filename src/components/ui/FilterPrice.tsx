import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'

type FilterPriceProps = {
  minprice: number
  maxprice: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

function valuetext(value: number) {
  return `$${value}`
}

export default function RangeSlider({
  minprice,
  maxprice,
  value,
  onChange,
}: FilterPriceProps) {
  // const [value, setValue] = React.useState<number[]>([20, 37]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onChange([newValue[0], newValue[1]])
    }
  }

  return (
    <div className="flex justify-center">
      <Box sx={{ width: 220 }}>
        <Slider
          getAriaLabel={() => 'Price range'}
          value={value}
          min={minprice}
          max={maxprice}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          valueLabelFormat={value => `$${value}`}
          color="secondary"
        />
      </Box>
    </div>
  )
}
