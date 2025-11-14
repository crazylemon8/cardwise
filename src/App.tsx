import { useState } from "react"
import { Slider } from "./components/Slider"

function App() {
  const [annualSpend, setAnnualSpend] = useState(100000);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Card Wise</h1>
          <p className="text-muted-foreground">Find your perfect credit card match</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border/50">
          <Slider
            min={10000}
            max={500000}
            step={5000}
            value={[annualSpend]}
            onValueChange={(value) => setAnnualSpend(value[0])}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

export default App
