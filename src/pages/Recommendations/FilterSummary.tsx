import { useState } from "react"

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
  const [isEditing, setIsEditing] = useState(false)
  const [editedFilters, setEditedFilters] = useState<Filters>(filters)

  const handleEdit = () => {
    setIsEditing(true)
    setEditedFilters(filters)
  }

  const handleSave = () => {
    setIsEditing(false)
    if (onFiltersChange) {
      onFiltersChange(editedFilters)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedFilters(filters)
  }

  const handleInputChange = (field: keyof Filters, value: string) => {
    const numValue = value === '' ? undefined : Number(value)
    setEditedFilters(prev => ({
      ...prev,
      [field]: numValue
    }))
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-medium">Your Filters</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs hover:bg-muted/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                Save
              </button>
            </>
          ) : (
            <button 
              onClick={handleEdit}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                <path d="m15 5 4 4"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Annual Spend (₹)
              </label>
              <input
                type="number"
                value={editedFilters.annualSpend ?? ''}
                onChange={(e) => handleInputChange('annualSpend', e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Groceries (₹)
              </label>
              <input
                type="number"
                value={editedFilters.groceries ?? ''}
                onChange={(e) => handleInputChange('groceries', e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Dining (₹)
              </label>
              <input
                type="number"
                value={editedFilters.dining ?? ''}
                onChange={(e) => handleInputChange('dining', e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Travel (₹)
              </label>
              <input
                type="number"
                value={editedFilters.travel ?? ''}
                onChange={(e) => handleInputChange('travel', e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Others (₹)
              </label>
              <input
                type="number"
                value={editedFilters.others ?? ''}
                onChange={(e) => handleInputChange('others', e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Annual Spend: {filters.annualSpend 
            ? `₹${filters.annualSpend.toLocaleString('en-IN')}` 
            : 'Not specified'}</span>
          {filters.groceries !== undefined && (
            <span>Groceries: ₹{filters.groceries.toLocaleString('en-IN')}</span>
          )}
          {filters.dining !== undefined && (
            <span>Dining: ₹{filters.dining.toLocaleString('en-IN')}</span>
          )}
          {filters.travel !== undefined && (
            <span>Travel: ₹{filters.travel.toLocaleString('en-IN')}</span>
          )}
          {filters.others !== undefined && (
            <span>Others: ₹{filters.others.toLocaleString('en-IN')}</span>
          )}
        </div>
      )}
    </div>
  )
}
