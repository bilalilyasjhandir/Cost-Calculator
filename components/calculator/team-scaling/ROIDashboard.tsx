"use client"

import { useTeamStore } from "@/store/teamStore"
import { currencies, formatCurrency, formatCurrencyShort, toDisplayCurrency, toUSD, CurrencyCode } from "@/lib/currencyConfig"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { Share, TrendingUp, Clock, DollarSign } from "lucide-react"

export function ROIDashboard() {
  const { 
    duration, setDuration, 
    masterRate, setMasterRate, 
    funding, setFunding, 
    ventureMode, setVentureMode, 
    exitVal, setExitVal, 
    estimate, updateEstimate,
    selectedCurrency, setCurrency
  } = useTeamStore()

  useEffect(() => {
    updateEstimate()
  }, [updateEstimate])

  const formatMoney = (val: number) => {
    return formatCurrency(val, selectedCurrency)
  }

  const formatK = (val: number) => {
    if (!val || !isFinite(val)) return formatCurrency(0, selectedCurrency);
    return formatCurrencyShort(val, selectedCurrency);
  }
  if (!estimate) return null;

  return (
    <div className="space-y-6 w-full">
      
      {/* ZONE 1: Dashboard Header Bar */}
      <div className="flex flex-col gap-4 p-4 border border-border bg-card rounded-xl">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex flex-col flex-1 gap-4">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Team ROI Dashboard</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Duration</label>
                <Select value={duration.toString()} onValueChange={(val) => setDuration(Number(val))}>
                  <SelectTrigger className="w-full bg-background h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 6, 12, 14, 18, 24].map(mo => (
                      <SelectItem key={mo} value={mo.toString()}>{mo} Mo</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Master Rate (Min {currencies[selectedCurrency].symbol}{currencies[selectedCurrency].symbolPosition === 'before_space' ? ' ' : ''}{Math.round(toDisplayCurrency(25, selectedCurrency))})</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{currencies[selectedCurrency].symbol}</span>
                  <Input 
                    type="number"
                    min={Math.round(toDisplayCurrency(25, selectedCurrency))}
                    value={toDisplayCurrency(masterRate, selectedCurrency) || ''}
                    onChange={(e) => {
                      const displayRate = Number(e.target.value);
                      const inUSD = toUSD(displayRate, selectedCurrency);
                      setMasterRate(Math.max(25, inUSD));
                    }}
                    className={`bg-background h-9 ${selectedCurrency === 'PKR' ? 'pl-11' : 'pl-6'}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Funding</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{currencies[selectedCurrency].symbol}</span>
                  <Input
                    type="number"
                    value={toDisplayCurrency(funding, selectedCurrency) || ''}
                    onChange={(e) => {
                      const displayFunding = Number(e.target.value);
                      const inUSD = toUSD(displayFunding, selectedCurrency);
                      setFunding(inUSD);
                    }}
                    className={`bg-background h-9 ${selectedCurrency === 'PKR' ? 'pl-11' : 'pl-6'}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Venture Mode</label>
                <Select value={ventureMode} onValueChange={(val) => setVentureMode(val as 'bootstrap' | 'startup_equity')}>
                  <SelectTrigger className="w-full bg-background h-9">
                      <SelectValue>
                        {ventureMode === 'bootstrap' ? 'Bootstrap' : 'Startup'}
                      </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bootstrap">Bootstrap</SelectItem>
                    <SelectItem value="startup_equity">Startup (Equity)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Currency</label>
                <Select value={selectedCurrency} onValueChange={(val) => setCurrency(val as CurrencyCode)}>
                  <SelectTrigger className="w-full bg-background h-9">
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

            <AnimatePresence>
              {ventureMode === 'startup_equity' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1.5 w-full md:w-1/4 overflow-hidden"
                >
                  <label className="text-[10px] font-bold text-accent uppercase tracking-wider">Exit Val</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-accent text-sm">{currencies[selectedCurrency].symbol}</span>
                    <Input
                      type="number"
                      value={exitVal ? toDisplayCurrency(exitVal, selectedCurrency) : ''}
                      placeholder={toDisplayCurrency(70, selectedCurrency).toString()}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) setExitVal(null);
                        else setExitVal(toUSD(Number(val), selectedCurrency));
                      }}
                      className={`pr-8 bg-accent/5 border-accent/50 text-accent h-9 ${selectedCurrency === 'PKR' ? 'pl-11' : 'pl-6'}`}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-accent text-sm font-bold">M</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          <div className="flex lg:flex-col gap-2 shrink-0 md:min-w-[140px] items-end justify-end">
            <button className="w-full h-9 flex items-center justify-center gap-2 border border-border hover:bg-muted text-sm font-medium rounded-md transition-colors">
              <Share className="w-4 h-4" /> Share
            </button>
            <button className="w-full h-9 flex items-center justify-center bg-accent text-accent-foreground text-sm font-bold rounded-md hover:opacity-90 transition-opacity">
              Get Estimate
            </button>
          </div>
        </div>
      </div>

      {/* ZONE 2: Dashboard Body (Three-column grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Cost Comparison */}
        <div className="flex flex-col gap-4">
          <Card className="p-5 border-border bg-card">
            <h4 className="font-bold text-foreground">In-House</h4>
            <div className="text-xs text-muted-foreground mb-4">Salary + Benefits</div>
            <div className="text-3xl font-black text-destructive mb-2">
              {formatK(estimate.inHouseTotal)}
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-3">
              <div className="h-full bg-destructive w-[95%]" />
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              High Overhead Model
            </div>
          </Card>

          <Card className="p-5 border-border bg-card">
            <h4 className="font-bold text-foreground">Staff Aug</h4>
            <div className="text-xs text-muted-foreground mb-4">Flat Rate + Agency</div>
            <div className="text-3xl font-black text-orange-400 mb-2">
              {formatK(estimate.staffAugTotal)}
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-3">
              <div className="h-full bg-orange-400 w-[100%]" />
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Agency Markup Model
            </div>
          </Card>

          <Card className="p-5 border-2 border-accent bg-accent/5 relative">
            <h4 className="font-bold text-foreground">Barakode Team</h4>
            <div className="text-xs text-muted-foreground mb-4">Subscription + AI</div>
            <div className="text-3xl font-black text-accent mb-2">
              {formatK(estimate.barakodeTotal)}
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-3">
              <div className="h-full bg-accent w-[35%]" />
            </div>
            <div className="text-xs font-bold text-accent uppercase tracking-wider">
              Zero Overhead Model
            </div>
          </Card>

          {/* Cost Efficiency Block */}
          {estimate.capitalPreserved > 0 && (
            <div className="text-sm p-2 text-muted-foreground">
              <p className="mb-3">Cost Efficiency measures your total capital output.</p>
              <div className="bg-muted p-4 rounded-xl border border-border/50 text-foreground leading-relaxed">
                Barakode reduces capital burn by <strong className="text-accent">{formatK(estimate.capitalPreserved)}</strong> by eliminating 30% traditional hiring overhead.
              </div>
            </div>
          )}
        </div>

        {/* MIDDLE COLUMN: Runway Forecast */}
        <div className="flex flex-col gap-6">
          <Card className="p-6 border-border bg-card flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-sm font-bold uppercase flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Runway Forecast
              </h3>
              <span className="text-xs text-muted-foreground">On {formatK(funding)} funding</span>
            </div>

            <div className="space-y-4">
              <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-sm">In-House <span className="text-[10px] bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded ml-2">HIGH BURN</span></div>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-2 flex-1 bg-destructive/20 rounded-full overflow-hidden">
                    <div className="h-full bg-destructive w-[90%]" />
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-muted-foreground">-{formatK(estimate.inHouseMonthlyBurn)}/mo</span>
                  <span className="text-2xl font-black text-destructive">{estimate.inHouseRunway === Number.POSITIVE_INFINITY ? '∞' : estimate.inHouseRunway.toFixed(1)} Mo</span>
                </div>
              </div>

              <div className="text-center text-xs text-muted-foreground font-bolditalic">vs</div>

              <div className="border border-accent/30 bg-accent/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-sm">Barakode <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded ml-2">OPTIMIZED</span></div>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-2 flex-1 bg-accent/20 rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[40%]" />
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-muted-foreground">-{formatK(estimate.barakodeMonthlyBurn)}/mo</span>
                  <span className="text-2xl font-black text-accent flex items-center gap-2">
                    {estimate.barakodeRunway === Number.POSITIVE_INFINITY ? '∞' : estimate.barakodeRunway.toFixed(1)} Mo
                  </span>
                </div>
                {estimate.runwayGainMonths > 0 && isFinite(estimate.runwayGainMonths) && (
                  <div className="text-right mt-1">
                    <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 rounded">+{estimate.runwayGainMonths.toFixed(1)} Mo Gain</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 mb-4 text-xs text-muted-foreground">
              Runway is how long your {formatK(funding)} lasts at current burn.
            </div>

            {estimate.survivalExtensionPercent > 0 && isFinite(estimate.survivalExtensionPercent) && (
              <div className="bg-muted p-3 rounded-lg border border-border/50 text-sm font-medium text-center">
                Barakode extends your survival by <span className="text-accent">{estimate.survivalExtensionPercent.toFixed(0)}%</span>.
              </div>
            )}

            <AnimatePresence>
              {ventureMode === 'startup_equity' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-6"
                >
                  <div className="border-t border-dashed border-border mb-6 w-full" />
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-sm font-bold text-purple-800 uppercase tracking-wider">Equity Saved</h4>
                      {estimate.equityDilutionPrevented !== null && estimate.equityDilutionPrevented > 0 && (
                        <div className="bg-purple-200 text-purple-900 text-[10px] font-bold px-2 py-1 rounded">
                          {estimate.equityDilutionPrevented.toFixed(2)}% Retention
                        </div>
                      )}
                    </div>
                    
                    <div className="text-3xl font-black text-purple-950 mb-1">
                      {formatK(estimate.capitalPreserved)} <span className="text-base font-medium text-purple-700">Preserved</span>
                    </div>
                    <div className="text-xs text-purple-700 mb-6">Founder Wealth Extension</div>

                    {!exitVal ? (
                      <p className="text-sm text-purple-600 border-t border-purple-200 pt-3">
                        Enter an Exit Valuation above to see equity dilution prevented.
                      </p>
                    ) : (
                      <>
                        <p className="text-xs text-purple-800 mb-4 leading-relaxed">
                          By saving {formatK(estimate.capitalPreserved)} in capital, you prevent <strong>{estimate.equityDilutionPrevented?.toFixed(2)}%</strong> ownership dilution at a projected ${exitVal}M exit.
                        </p>
                        <div className="bg-purple-100 p-3 rounded border border-purple-200 text-xs text-center text-purple-800 font-medium">
                          Barakode acts as <strong className="text-purple-950">Non-Dilutive Capital</strong> for your engineering growth.
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </Card>
        </div>

        {/* RIGHT COLUMN: Velocity + Preserved */}
        <div className="flex flex-col gap-6">
          
          {/* Velocity */}
          <Card className="p-6 border-border bg-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold uppercase flex items-center gap-2">
                <Clock className="w-4 h-4" /> Velocity
              </h3>
              <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded">3 Mo Faster</span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-medium mb-2">
                  <span>Traditional Model</span>
                  <span className="text-destructive">-3mo Waiting</span>
                </div>
                <div className="h-5 w-full rounded flex overflow-hidden">
                  <div className="h-full bg-destructive/70 w-[25%] flex items-center justify-center text-[8px] font-bold text-destructive-foreground">HIRING RISK</div>
                  <div className="h-full bg-muted-foreground/30 w-[75%] flex items-center justify-center text-[8px] font-bold text-foreground">BUILD</div>
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1 uppercase">
                  <span>Month 0</span>
                  <span>Month 3 (Start)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-2">
                  <span>Barakode Execution</span>
                  <span className="text-blue-500">Instant Start</span>
                </div>
                <div className="h-5 w-full rounded flex overflow-hidden">
                  <div className="h-full bg-blue-500 w-full flex items-center justify-center text-[9px] font-bold text-white">FULL BUILDING CAPACITY FROM DAY 1</div>
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1 uppercase">
                  <span>Start Now</span>
                  <span>Full Momentum</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-6 mb-4">Velocity is your speed to Market Entry.</p>
            
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 text-sm font-medium text-blue-500 text-center flex items-center justify-center gap-2">
              🚀 Launch 3 Months sooner than traditional hiring.
            </div>
          </Card>

          {/* Total Capital Preserved */}
          <Card className="p-6 border-accent/20 bg-accent/5 shadow-[0_0_20px_rgba(193,139,19,0.05)] flex-grow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-sm font-bold uppercase text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent" /> Total Capital Preserved
                </h3>
                <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded">
                  ROI Maximized
                </span>
              </div>

              <div className="text-4xl lg:text-5xl font-black text-foreground mb-1 tracking-tight">
                {formatMoney(estimate.capitalPreserved)}
              </div>
              <div className="text-sm font-bold text-accent mb-6">
                Barakode Augmented: 60% AI Support
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Hiring & Perks</span>
                  <span className="font-medium">Eliminated</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Management Tax</span>
                  <span className="font-medium">Zero</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Monthly Retention</span>
                  <span className="font-bold text-accent">{formatMoney(estimate.monthlyRetention)}/mo</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-background border border-accent/20 rounded-lg p-4 text-sm font-medium text-center leading-relaxed mb-4">
                Reinvest this <strong className="text-accent">{formatMoney(estimate.monthlyRetention)}/mo</strong> into Product or Marketing instead of overhead.
              </div>
              <div className="text-[10px] text-muted-foreground italic text-center">
                *Total savings vs. traditional scaling models.
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  )
}
