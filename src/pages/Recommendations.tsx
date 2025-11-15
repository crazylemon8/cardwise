import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../components/Button"
import Loader from "../components/Loder"
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
  const navigate = useNavigate()
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Your Recommendations</h1>
          <p className="text-muted-foreground">Based on your spending profile</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border/50">
          {isLoading ? (
            <div className="py-12">
              <Loader size="large" className="mb-4" />
              <p className="text-center text-muted-foreground">
                Finding the best credit cards for you...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your Filters</h2>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Annual Spend:</span>
                    <span className="font-semibold">
                      {filters.annualSpend 
                        ? `₹${filters.annualSpend.toLocaleString()}` 
                        : 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {recommendations.length === 0 ? (
                <p className="text-center text-muted-foreground pt-4">
                  No credit card recommendations found based on your filters.
                </p>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Recommended Cards ({recommendations.length})
                  </h2>
                  <div className="space-y-4">
                    {recommendations.map((card) => (
                      <div
                        key={card.id}
                        className="bg-muted/30 p-6 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold">{card.name}</h3>
                            <p className="text-sm text-muted-foreground">{card.issuer}</p>
                          </div>
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                            {card.category}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Annual Fee</p>
                            <p className="font-semibold">
                              {card.annualFee === 0 ? 'Free' : `₹${card.annualFee.toLocaleString()}`}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Rewards Rate</p>
                            <p className="font-semibold">{card.rewardsRate}%</p>
                          </div>
                          {card.signUpBonus && (
                            <div>
                              <p className="text-xs text-muted-foreground">Sign-up Bonus</p>
                              <p className="font-semibold">₹{card.signUpBonus.toLocaleString()}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-muted-foreground">Min Credit Score</p>
                            <p className="font-semibold">{card.minCreditScore}</p>
                          </div>
                        </div>

                        {card.benefits && card.benefits.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Key Benefits</p>
                            <ul className="text-sm space-y-1">
                              {card.benefits.slice(0, 3).map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                className="w-full mt-6" 
                onClick={() => navigate('/')}
                variant="outline"
              >
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
