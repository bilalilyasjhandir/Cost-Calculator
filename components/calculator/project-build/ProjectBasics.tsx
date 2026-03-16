"use client"

import { useProjectStore } from "@/store/projectStore"
import { currencies, toDisplayCurrency, toUSD, CurrencyCode } from "@/lib/currencyConfig"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

export function ProjectBasics() {
  const { 
    hourlyRate, setHourlyRate, 
    aiEfficiency, setAiEfficiency, 
    industry, setIndustry,
    selectedCurrency, setCurrency 
  } = useProjectStore()

  return (
    <Card className="p-6 mb-8 border-border bg-card">
      <h3 className="text-xl font-bold mb-6">Project Parameters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground block whitespace-nowrap">
            Hourly Rate (Min {currencies[selectedCurrency].symbol}{currencies[selectedCurrency].symbolPosition === 'before_space' ? ' ' : ''}{Math.round(toDisplayCurrency(25, selectedCurrency))})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencies[selectedCurrency].symbol}</span>
            <Input
              type="number"
              min={Math.round(toDisplayCurrency(25, selectedCurrency))}
              value={toDisplayCurrency(hourlyRate, selectedCurrency) || ''}
              onChange={(e) => {
                const displayRate = Number(e.target.value);
                const inUSD = toUSD(displayRate, selectedCurrency);
                setHourlyRate(Math.max(25, inUSD));
              }}
              className={`!bg-transparent ${selectedCurrency === 'PKR' ? 'pl-11' : 'pl-8'}`}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground block">
            Industry
          </label>
          <Select value={industry} onValueChange={(val) => setIndustry(val || "")}>
            <SelectTrigger className="w-full !bg-transparent">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Retail & E-Commerce">Retail & E-Commerce</SelectItem>
              <SelectItem value="Logistics & Supply Chain">Logistics & Supply Chain</SelectItem>
              <SelectItem value="Fintech & Banking">Fintech & Banking</SelectItem>
              <SelectItem value="Edtech & Learning">Edtech & Learning</SelectItem>
              <SelectItem value="Field Services">Field Services</SelectItem>
              <SelectItem value="Remote Work Platforms">Remote Work Platforms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground block">
            Currency
          </label>
          <Select value={selectedCurrency} onValueChange={(val) => setCurrency(val as CurrencyCode)}>
            <SelectTrigger className="w-full !bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">$ USD</SelectItem>
              <SelectItem value="SAR">⃁ SAR</SelectItem>
              <SelectItem value="PKR">PKR PKR</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      <div className="space-y-4 pt-4 border-t border-border/50">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-muted-foreground">
            AI Code Efficiency (Barakode Engine)
          </label>
          <span className="text-accent font-bold text-sm bg-accent/10 px-2 py-1 rounded">
            {aiEfficiency}% Efficiency Boost
          </span>
        </div>
        <Slider 
          value={[aiEfficiency]} 
          onValueChange={(val) => setAiEfficiency(Array.isArray(val) ? val[0] : val)} 
          max={60} 
          step={1}
          className="[&_[role=slider]]:border-accent [&_[role=slider]]:bg-accent [&_[data-slot=slider-track]]:bg-muted-foreground/30 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:size-4"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Leveraging AI reduces total estimated build cost by the percentage selected above.
        </p>
      </div>

    </Card>
  )
}
