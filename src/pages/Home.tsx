import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Slider } from "../components/Slider"
import { Button } from "../components/Button";

export default function Home() {
  const [annualSpend, setAnnualSpend] = useState(100000);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Card Wise</h1>
          <p className="text-muted-foreground">Find your perfect credit card match</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border/50">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span>Annual Spend</span>
                <span>₹{annualSpend.toLocaleString('en-IN')}</span>
              </div>
              <Slider
                min={10000}
                max={500000}
                step={5000}
                value={[annualSpend]}
                onValueChange={(value) => setAnnualSpend(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹10k</span>
                <span>₹5L</span>
              </div>
            </div>
            <div>
              <Button className="w-full mt-6" onClick={() => navigate(`/recommendations?annualSpend=${annualSpend}`)}>Get recommendations</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
