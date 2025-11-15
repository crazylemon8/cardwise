import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Loader from "../components/Loder"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table"
import { cardsRouter } from "../server/api/cards.api"
import type { Card } from "../server/types"

// Scalable filter interface for future expansion
interface Filters {
  annualSpend?: number
  // Add more filters here as needed, e.g.:
  // spendingCategory?: string
  // preferredBanks?: string[]
  // rewardType?: string
}

export default function Recommendations() {
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<Card[]>([])
  
  // Parse filters from URL params - scalable approach
  const filters: Filters = {
    annualSpend: searchParams.get('annualSpend') 
      ? Number(searchParams.get('annualSpend')) 
      : undefined,
    // Future filters can be parsed here
  }

  // Fetch recommendations from API
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true)
      try {
        const response = await cardsRouter.getRecommendations()
        
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
  }, [filters.annualSpend])

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-medium">Card Wise</h1>
          <p className="text-xs text-muted-foreground">Based on your spending profile</p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium mb-1">Your Filters</h2>
              <p className="text-xs text-muted-foreground">
                Annual Spend: {filters.annualSpend 
                  ? `₹${filters.annualSpend.toLocaleString('en-IN')}` 
                  : 'Not specified'}
              </p>
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
                        <TableHead>Issuer</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Annual Fee</TableHead>
                        <TableHead className="text-right">Rewards Rate</TableHead>
                        <TableHead className="text-right">Sign-up Bonus</TableHead>
                        <TableHead className="text-right">Min Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recommendations.map((card) => (
                        <TableRow key={card.id}>
                          <TableCell className="font-medium">{card.name}</TableCell>
                          <TableCell>{card.issuer}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                              {card.category}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {card.annualFee === 0 ? 'Free' : `₹${card.annualFee.toLocaleString()}`}
                          </TableCell>
                          <TableCell className="text-right">{card.rewardsRate}%</TableCell>
                          <TableCell className="text-right">
                            {card.signUpBonus ? `₹${card.signUpBonus.toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell className="text-right">{card.minCreditScore}</TableCell>
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
