import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../../components/Button"
import { cardsData } from "../../server/cards/cards.data"
import type { CardReadable } from "../../server/types"
import { categories } from "../../server/categories/categories.data"

export default function CardDetail() {
  const { cardId } = useParams<{ cardId: string }>()
  const navigate = useNavigate()
  const [card, setCard] = useState<CardReadable | null>(null)

  useEffect(() => {
    // Find card by ID
    const foundCard = cardsData.find(c => c.id === cardId)
    if (foundCard) {
      setCard(foundCard)
    }
  }, [cardId])

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted/20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Card not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || categoryId
  }

  const getRenewalBenefitDescription = () => {
    if (!card.renewal) return "No renewal benefit"

    switch (card.renewal.type) {
      case 'fee_waiver':
        return card.renewal.fee_waiver 
          ? `Annual fee waived${card.renewal.condition?.annual_spend_threshold ? ` (spend ${formatCurrency(card.renewal.condition.annual_spend_threshold)})` : ''}`
          : "Conditional fee waiver"
      case 'points':
        return `${card.renewal.points || 'Tiered'} reward points${card.renewal.value_in_inr ? ` (₹${card.renewal.value_in_inr})` : ''}`
      case 'voucher':
        return `Voucher worth ${formatCurrency(card.renewal.value_in_inr || 0)}`
      case 'none':
        return "No renewal benefit"
      default:
        return "See notes for details"
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Back
          </Button>
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border/50">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{card.name}</h1>
                <p className="text-xl text-muted-foreground">{card.issuer}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Annual Fee</p>
                <p className="text-2xl font-bold">{formatCurrency(card.annual_fee)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl shadow border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Welcome Benefit</p>
            <p className="text-2xl font-bold">{formatCurrency(card.welcome_net)}</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl shadow border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">FX Markup</p>
            <p className="text-2xl font-bold">{card.fx_markup_pct}%</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl shadow border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Verified</p>
            <p className="text-lg font-semibold">{new Date(card.verified_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Reward Rates */}
        <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border/50 mb-6">
          <h2 className="text-2xl font-bold mb-6">Reward Rates</h2>
          <div className="space-y-4">
            {Object.entries(card.eff_rates).map(([category, rate]) => (
              <div key={category} className="flex justify-between items-center pb-3 border-b border-border/30 last:border-0">
                <div>
                  <p className="font-medium">{getCategoryName(category)}</p>
                  {card.caps[category as keyof typeof card.caps] > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Cap: {formatCurrency(card.caps[category as keyof typeof card.caps])} 
                      {card.post_cap_rates[category as keyof typeof card.post_cap_rates] !== rate && (
                        <span> → then {formatPercentage(card.post_cap_rates[category as keyof typeof card.post_cap_rates])}</span>
                      )}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatPercentage(rate)}</p>
                  {rate === 0 && (
                    <p className="text-xs text-muted-foreground">Excluded</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Renewal Benefits */}
        {card.renewal && (
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border/50 mb-6">
            <h2 className="text-2xl font-bold mb-4">Renewal Benefits</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Type:</p>
                <p className="font-semibold capitalize">{card.renewal.type.replace('_', ' ')}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Benefit:</p>
                <p className="font-semibold">{getRenewalBenefitDescription()}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Applies First Year:</p>
                <p className="font-semibold">{card.renewal.applies_first_year ? 'Yes' : 'No'}</p>
              </div>
              {card.renewal.notes && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm whitespace-pre-line">{card.renewal.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Exclusions */}
        {card.exclusions && card.exclusions.length > 0 && (
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border/50 mb-6">
            <h2 className="text-2xl font-bold mb-4">Exclusions</h2>
            <div className="flex flex-wrap gap-2">
              {card.exclusions.map((exclusion, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-muted/50 rounded-full text-sm capitalize"
                >
                  {exclusion.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Notes */}
        {card.notes && (
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border/50">
            <h2 className="text-2xl font-bold mb-4">Additional Notes</h2>
            <p className="text-muted-foreground whitespace-pre-line">{card.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
