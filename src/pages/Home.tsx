import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Slider } from "../components/Slider"
import { Button } from "../components/Button"
import { Input } from "../components/Input"

export default function Home() {
  const [annualSpend, setAnnualSpend] = useState(100000);
  const [groceries, setGroceries] = useState(25000);
  const [dining, setDining] = useState(25000);
  const [travel, setTravel] = useState(25000);
  const [others, setOthers] = useState(25000);
  const navigate = useNavigate();

  const handleCategoryChange = (category: 'groceries' | 'dining' | 'travel' | 'others', value: number) => {
    const newValue = Math.max(0, value);
    let remaining = annualSpend;

    if (category === 'groceries') {
      setGroceries(newValue);
      remaining = annualSpend - newValue - dining - travel;
      setOthers(Math.max(0, remaining));
    } else if (category === 'dining') {
      setDining(newValue);
      remaining = annualSpend - groceries - newValue - travel;
      setOthers(Math.max(0, remaining));
    } else if (category === 'travel') {
      setTravel(newValue);
      remaining = annualSpend - groceries - dining - newValue;
      setOthers(Math.max(0, remaining));
    } else if (category === 'others') {
      setOthers(newValue);
    }
  };

  const handleAnnualSpendChange = (value: number) => {
    setAnnualSpend(value);
    const remaining = value - groceries - dining - travel;
    setOthers(Math.max(0, remaining));
  };
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
                onValueChange={(value) => handleAnnualSpendChange(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹10k</span>
                <span>₹5L</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <label className="text-sm">Groceries</label>
                <Input
                  type="number"
                  value={groceries}
                  onChange={(e) => handleCategoryChange('groceries', Number(e.target.value))}
                  className="w-24 h-7 text-sm py-1 focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between items-center gap-4">
                <label className="text-sm">Dining</label>
                <Input
                  type="number"
                  value={dining}
                  onChange={(e) => handleCategoryChange('dining', Number(e.target.value))}
                  className="w-24 h-7 text-sm py-1 focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between items-center gap-4">
                <label className="text-sm">Travel</label>
                <Input
                  type="number"
                  value={travel}
                  onChange={(e) => handleCategoryChange('travel', Number(e.target.value))}
                  className="w-24 h-7 text-sm py-1 focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between items-center gap-4">
                <label className="text-sm">Others</label>
                <Input
                  type="number"
                  value={others}
                  onChange={(e) => handleCategoryChange('others', Number(e.target.value))}
                  className="w-24 h-7 text-sm py-1 focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="0"
                  disabled
                />
              </div>
            </div>
            
            <div>
              <Button className="w-full" onClick={() => navigate(`/recommendations?annualSpend=${annualSpend}&groceries=${groceries}&dining=${dining}&travel=${travel}&others=${others}`)}>Get recommendations</Button>
            </div>
          </div>

          <div className="border-t border-border/50 mt-6"></div>

          <div className="text-center pt-4">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" onClick={() => navigate('/all-cards')}>
              All Cards
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
