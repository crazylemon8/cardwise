import { useState, useEffect } from "react"
import { Slider } from "../../components/Slider"

interface Filters {
  annualSpend?: number
  groceries?: number
  dining?: number
  travel?: number
  others?: number
}

interface FilterSummaryProps {
  filters: Filters
  onFiltersChange?: (filters: Filters) => void
}

export default function FilterSummary({ filters, onFiltersChange }: FilterSummaryProps) {
  const [groceries, setGroceries] = useState(filters.groceries || 25000)
  const [dining, setDining] = useState(filters.dining || 25000)
  const [travel, setTravel] = useState(filters.travel || 25000)
  const [miscellaneous, setMiscellaneous] = useState(filters.others || 25000)

  const totalSpend = groceries + dining + travel + miscellaneous

  // Update local state when filters prop changes
  useEffect(() => {
    setGroceries(filters.groceries || 25000)
    setDining(filters.dining || 25000)
    setTravel(filters.travel || 25000)
    setMiscellaneous(filters.others || 25000)
  }, [filters])

  const handleCategoryChange = (category: 'groceries' | 'dining' | 'travel' | 'miscellaneous', value: number) => {
    const newValue = Math.max(0, value)
    
    if (category === 'groceries') {
      setGroceries(newValue)
      notifyChange(newValue, dining, travel, miscellaneous)
    } else if (category === 'dining') {
      setDining(newValue)
      notifyChange(groceries, newValue, travel, miscellaneous)
    } else if (category === 'travel') {
      setTravel(newValue)
      notifyChange(groceries, dining, newValue, miscellaneous)
    } else if (category === 'miscellaneous') {
      setMiscellaneous(newValue)
      notifyChange(groceries, dining, travel, newValue)
    }
  }

  const notifyChange = (groc: number, din: number, trav: number, misc: number) => {
    if (onFiltersChange) {
      onFiltersChange({
        groceries: groc,
        dining: din,
        travel: trav,
        others: misc
      })
    }
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-border/50 lg:sticky lg:top-6">
      <div className="mb-4 lg:block hidden">
        <h2 className="text-base font-medium">Filters</h2>
        <p className="text-xs text-muted-foreground">Adjust your spending profile</p>
      </div>

      <div className="space-y-6">
        {/* Total Spend Display */}
        <div className="flex justify-end pb-2 border-b border-border/50">
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Total Annual Spend</p>
            <p className="text-xl font-semibold">₹{totalSpend.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Groceries */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-sm">Groceries</label>
            <div className="relative border-b border-dotted border-foreground/40 pb-0.5">
              <span className="text-muted-foreground text-sm">₹</span>
              <input
                type="number"
                value={groceries}
                onChange={(e) => handleCategoryChange('groceries', Number(e.target.value) || 0)}
                className="w-auto min-w-[3ch] bg-transparent border-none outline-none text-right text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                style={{ width: `${String(groceries).length}ch` }}
              />
            </div>
          </div>
          <Slider
            min={0}
            max={500000}
            step={1000}
            value={[groceries]}
            onValueChange={(value) => handleCategoryChange('groceries', value[0])}
            className="w-full"
          />
        </div>

        {/* Dining */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-sm">Dining</label>
            <div className="relative border-b border-dotted border-foreground/40 pb-0.5">
              <span className="text-muted-foreground text-sm">₹</span>
              <input
                type="number"
                value={dining}
                onChange={(e) => handleCategoryChange('dining', Number(e.target.value) || 0)}
                className="w-auto min-w-[3ch] bg-transparent border-none outline-none text-right text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                style={{ width: `${String(dining).length}ch` }}
              />
            </div>
          </div>
          <Slider
            min={0}
            max={500000}
            step={1000}
            value={[dining]}
            onValueChange={(value) => handleCategoryChange('dining', value[0])}
            className="w-full"
          />
        </div>

        {/* Travel */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-sm">Travel</label>
            <div className="relative border-b border-dotted border-foreground/40 pb-0.5">
              <span className="text-muted-foreground text-sm">₹</span>
              <input
                type="number"
                value={travel}
                onChange={(e) => handleCategoryChange('travel', Number(e.target.value) || 0)}
                className="w-auto min-w-[3ch] bg-transparent border-none outline-none text-right text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                style={{ width: `${String(travel).length}ch` }}
              />
            </div>
          </div>
          <Slider
            min={0}
            max={500000}
            step={1000}
            value={[travel]}
            onValueChange={(value) => handleCategoryChange('travel', value[0])}
            className="w-full"
          />
        </div>

        {/* Miscellaneous */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-sm">Miscellaneous</label>
            <div className="relative border-b border-dotted border-foreground/40 pb-0.5">
              <span className="text-muted-foreground text-sm">₹</span>
              <input
                type="number"
                value={miscellaneous}
                onChange={(e) => handleCategoryChange('miscellaneous', Number(e.target.value) || 0)}
                className="w-auto min-w-[3ch] bg-transparent border-none outline-none text-right text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                style={{ width: `${String(miscellaneous).length}ch` }}
              />
            </div>
          </div>
          <Slider
            min={0}
            max={500000}
            step={1000}
            value={[miscellaneous]}
            onValueChange={(value) => handleCategoryChange('miscellaneous', value[0])}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
