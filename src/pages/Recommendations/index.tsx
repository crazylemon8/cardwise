import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Loader from "../../components/Loder"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table"
import { cardsRouter } from "../../server/api/cards.api"
import type { CardWithRewards } from "../../server/types"

// Scalable filter interface for future expansion
interface Filters {
  annualSpend?: number
  groceries?: number
  dining?: number
  travel?: number
  others?: number
}

export default function Recommendations() {
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<CardWithRewards[]>([])
  
  // Parse filters from URL params - scalable approach
  const filters: Filters = {
    annualSpend: searchParams.get('annualSpend') 
      ? Number(searchParams.get('annualSpend')) 
      : undefined,
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
  }, [filters.annualSpend, filters.groceries, filters.dining, filters.travel, filters.others])

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-medium">Card Wise</h1>
          <p className="text-xs text-muted-foreground">Based on your spending profile</p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-base font-medium mb-2">Your Filters</h2>
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
            </div>
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
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
          </div>
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
  )
}
