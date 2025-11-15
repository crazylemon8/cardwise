import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../components/Button"

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
  
  // Parse filters from URL params - scalable approach
  const filters: Filters = {
    annualSpend: searchParams.get('annualSpend') 
      ? Number(searchParams.get('annualSpend')) 
      : undefined,
    // Future filters can be parsed here
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Your Recommendations</h1>
          <p className="text-muted-foreground">Based on your spending profile</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border/50">
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
            <p className="text-center text-muted-foreground pt-4">
              Credit card recommendations will appear here based on your filters.
            </p>
            <Button 
              className="w-full mt-6" 
              onClick={() => navigate('/')}
              variant="outline"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
