import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { createClient } from "@supabase/supabase-js";

import Loader from "../../components/Loder"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table"
import { cardsRouter } from "../../server/api/cards.api"
import type { CardWithRewards } from "../../server/types"
import { Button } from "../../components/Button"

import FilterSummary from "./FilterSummary"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

// Scalable filter interface for future expansion
interface Filters {
  groceries?: number
  dining?: number
  travel?: number
  others?: number
}

export default function Recommendations() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<CardWithRewards[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState<Filters>({})

  const [cards, setCards] = useState<Array<{ id: string }>>([]);
  
  // Parse filters from URL params - scalable approach
  const [filters, setFilters] = useState<Filters>({
    groceries: searchParams.get('groceries')
      ? Number(searchParams.get('groceries'))
      : undefined,
    dining: searchParams.get('dining')
      ? Number(searchParams.get('dining'))
      : undefined,
    travel: searchParams.get('travel')
      ? Number(searchParams.get('travel'))
      : undefined,
    others: searchParams.get('others')
      ? Number(searchParams.get('others'))
      : undefined,
  })

  // Handle filter changes
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
    
    // Update URL params
    const params = new URLSearchParams()
    if (newFilters.groceries) params.set('groceries', newFilters.groceries.toString())
    if (newFilters.dining) params.set('dining', newFilters.dining.toString())
    if (newFilters.travel) params.set('travel', newFilters.travel.toString())
    if (newFilters.others) params.set('others', newFilters.others.toString())
    
    navigate(`/recommendations?${params.toString()}`, { replace: true })
  }

  // Fetch recommendations from API
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true)
      try {
        const response = await cardsRouter.getRecommendations(filters)
        
        if (response.success && response.data) {
          setRecommendations(response.data)
        } else {
          console.error('Failed to fetch recommendations:', response.error)
          setRecommendations([])
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        setRecommendations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [filters.groceries, filters.dining, filters.travel, filters.others])

  async function getCards() {
    try {
      const { data: CreditCards, error } = await supabase
        .from('CreditCards')
        .select('*')

      if (error) {
        console.error("Supabase error:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return;
      }

      console.log("Instruments data:", CreditCards);
      console.log("Number of records:", CreditCards?.length);
      setCards(CreditCards || []);
    } catch (err) {
      console.error("Unexpected error fetching cards:", err);
    }
  }

  useEffect(() => {
    getCards();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl font-medium">Card Wise</h1>
          <p className="text-xs text-muted-foreground">Based on your spending profile</p>
        </div>
        
        <div className="flex gap-6">
          {/* Left Filter Panel - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSummary filters={filters} onFiltersChange={handleFiltersChange} />
          </div>

          {/* Right Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4 flex justify-end">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card/70 transition-colors"
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
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50">
              {isLoading ? (
                <div className="py-12">
                  <Loader size="large" className="mb-4" />
                  <p className="text-center text-muted-foreground">
                    Finding the best credit cards for you...
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recommendations.length === 0 ? (
                    <p className="text-center text-muted-foreground pt-4">
                      No credit card recommendations found based on your filters.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <h2 className="text-base font-medium">
                        Recommended Cards ({recommendations.length})
                      </h2>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Card Name</TableHead>
                            <TableHead className="text-right">Annual Fee</TableHead>
                            <TableHead className="text-right">Welcome Benefit</TableHead>
                            <TableHead className="text-right">Year 1 Value</TableHead>
                            <TableHead className="text-right">Year 2+ Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recommendations.map((rec) => (
                            <TableRow key={rec.card.id} className="cursor-pointer hover:bg-muted/30" onClick={() => window.location.href = `/card/${rec.card.id}`}>
                              <TableCell className="font-medium">
                                <Link to={`/card/${rec.card.id}`} className="text-blue-600 hover:underline">
                                  {rec.card.name}
                                </Link>
                              </TableCell>
                              <TableCell className="text-right">
                                {rec.annualFee === 0 ? 'Free' : `₹${rec.annualFee.toLocaleString()}`}
                              </TableCell>
                              <TableCell className="text-right text-blue-600">
                                ₹{rec.welcomeBenefit.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                <span className={rec.netValue >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  ₹{rec.netValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </span>
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                <span className={rec.subsequentYearValue >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  ₹{rec.subsequentYearValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal - Full Screen */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-gradient-to-br from-background to-muted/20">
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-medium">Filters</h2>
                    <p className="text-xs text-muted-foreground">Adjust your spending profile</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsFilterOpen(false)
                      setTempFilters({})
                    }}
                    className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                {/* Filter Content */}
                <FilterSummary 
                  filters={Object.keys(tempFilters).length > 0 ? tempFilters : filters} 
                  onFiltersChange={(newFilters) => {
                    setTempFilters(newFilters)
                  }} 
                />

                {/* Apply Button */}
                <div className="mt-6">
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      if (Object.keys(tempFilters).length > 0) {
                        handleFiltersChange(tempFilters)
                      }
                      setIsFilterOpen(false)
                      setTempFilters({})
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
