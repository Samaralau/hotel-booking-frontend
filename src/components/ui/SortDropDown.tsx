interface SortDropdownProps {
  selectedvalue: string
  setvalue: React.Dispatch<React.SetStateAction<string>> // update string state value with usestate
}

export default function Sortdropdown({
  selectedvalue,
  setvalue,
}: SortDropdownProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setvalue(event.target.value)
  }

  return (
    <div>
      <label htmlFor="sortdropdown">Sort list by: </label>
      <select id="sortdropdown" value={selectedvalue} onChange={handleChange}>
        <option value="Price (Ascending)">Price (Ascending)</option>
        <option value="Price (Descending)">Price (Descending)</option>
        <option value="Rating (Ascending)">Rating (Ascending)</option>
        <option value="Rating (Descending)">Rating (Descending)</option>
      </select>
    </div>
  )
}
