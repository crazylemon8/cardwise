import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Slider } from "../components/Slider"
import { Button } from "../components/Button"

export default function Home() {
  const [annualSpend, setAnnualSpend] = useState(100000);
  const [groceries, setGroceries] = useState(25000);
  const [dining, setDining] = useState(25000);
  const [travel, setTravel] = useState(25000);
  const [miscellaneous, setMiscellaneous] = useState(25000);
  const navigate = useNavigate();

  const handleCategoryChange = (category: 'groceries' | 'dining' | 'travel' | 'miscellaneous', value: number) => {
    const newValue = Math.max(0, value);
    
    if (category === 'groceries') {
      const maxAllowed = annualSpend - dining - travel;
      const cappedValue = Math.min(newValue, maxAllowed);
      setGroceries(cappedValue);
      setMiscellaneous(Math.max(0, annualSpend - cappedValue - dining - travel));
    } else if (category === 'dining') {
      const maxAllowed = annualSpend - groceries - travel;
      const cappedValue = Math.min(newValue, maxAllowed);
      setDining(cappedValue);
      setMiscellaneous(Math.max(0, annualSpend - groceries - cappedValue - travel));
    } else if (category === 'travel') {
      const maxAllowed = annualSpend - groceries - dining;
      const cappedValue = Math.min(newValue, maxAllowed);
      setTravel(cappedValue);
      setMiscellaneous(Math.max(0, annualSpend - groceries - dining - cappedValue));
    } else if (category === 'miscellaneous') {
      const maxAllowed = annualSpend - groceries - dining - travel;
      const cappedValue = Math.min(newValue, maxAllowed);
      setMiscellaneous(cappedValue);
    }
  };

  const handleAnnualSpendChange = (value: number) => {
    setAnnualSpend(value);
    const remaining = value - groceries - dining - travel;
    setMiscellaneous(Math.max(0, remaining));
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
                <div className="relative border-b border-dotted border-foreground/40 pb-0.5">
                  <span className="text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={annualSpend}
                    onChange={(e) => handleAnnualSpendChange(Number(e.target.value) || 0)}
                    className="w-auto min-w-[3ch] bg-transparent border-none outline-none text-right focus:border-foreground [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    style={{ width: `${String(annualSpend).length}ch` }}
                  />
                </div>
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

            <div className="space-y-6">
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
                  max={annualSpend}
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
                  max={annualSpend}
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
                  max={annualSpend}
                  step={1000}
                  value={[travel]}
                  onValueChange={(value) => handleCategoryChange('travel', value[0])}
                  className="w-full"
                />
              </div>

              {/* Miscellaneous (calculated) */}
              <div className="flex justify-between items-center gap-4">
                <label className="text-sm">Miscellaneous</label>
                <div className="relative">
                  <span className="text-muted-foreground text-sm">₹</span>
                  <span className="text-sm">{miscellaneous.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            
            <div>
              <Button className="w-full" onClick={() => navigate(`/recommendations?annualSpend=${annualSpend}&groceries=${groceries}&dining=${dining}&travel=${travel}&others=${miscellaneous}`)}>Get recommendations</Button>
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
