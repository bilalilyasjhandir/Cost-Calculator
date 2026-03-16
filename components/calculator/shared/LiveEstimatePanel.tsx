"use client"

import { useProjectStore } from "@/store/projectStore"
import { formatCurrency } from "@/lib/currencyConfig"
import { motion } from "framer-motion"
import { useState } from "react"
import { Share, Download, GitCompare } from "lucide-react"
import { CompareModal } from "../project-build/CompareModal"

export function LiveEstimatePanel() {
  const { estimate, aiEfficiency, selectedPlatform, selectedCurrency } = useProjectStore()
  const [copied, setCopied] = useState(false)
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)

  const handleShare = () => {
    // Dummy handler for now, spec says Next Step
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format dollars safely
  const formatMoney = (val: number) => {
    return formatCurrency(val, selectedCurrency)
  }

  if (!estimate) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 lg:p-8 sticky top-6 text-center opacity-50 flex flex-col justify-center items-center">
        <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-6 self-start">
          Live Estimate
        </h2>
        <p className="text-muted-foreground flex-1 flex items-center justify-center min-h-[200px]">Select a platform and features to see your live estimate.</p>
        
        <div className="w-full flex flex-col gap-3 mt-8">
          <div className="group relative w-full">
            <button 
              disabled
              className="w-full flex items-center justify-center gap-2 border border-border py-3 rounded-lg font-bold text-sm bg-muted text-muted-foreground cursor-not-allowed"
            >
              <GitCompare className="w-4 h-4" />
              COMPARE MVP vs FULL BUILD
            </button>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              Select a platform first
            </span>
          </div>

          <button disabled className="w-full flex items-center justify-center gap-2 bg-[#c18b43]/50 text-white py-3 rounded-lg font-bold cursor-not-allowed">
            <Download className="w-4 h-4" />
            EXPORT REPORT
          </button>
          <button disabled className="w-full flex items-center justify-center gap-2 border border-border bg-muted py-3 rounded-lg font-bold cursor-not-allowed">
            <Share className="w-4 h-4" />
            SHARE CALCULATION
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border shadow-2xl rounded-xl p-6 lg:p-8 sticky top-6">
      <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-6">
        Live Estimate
      </h2>
      
      <div className="mb-8">
        <motion.div 
          key={estimate.totalEstimatedCost}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-black tracking-tighter mb-2"
        >
          {formatMoney(estimate.totalEstimatedCost)}
        </motion.div>
        
        {estimate.youSave > 0 && (
          <div className="flex items-center gap-2 text-sm mt-3">
            <span className="text-muted-foreground line-through">
              {formatMoney(estimate.marketValue)} Market Value
            </span>
            <span className="text-[#c18b43] font-bold bg-[#c18b43]/10 px-2 py-0.5 rounded">
              Save {formatMoney(estimate.youSave)}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 text-sm mb-8 border-t border-b border-border/50 py-6">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Estimated Time</span>
          <span className="font-bold">
            {estimate.estimatedWeeks > 0 
              ? `~${estimate.estimatedWeeks} Weeks / ~${estimate.estimatedMonths.toFixed(1)} Months` 
              : "—"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Platform Base</span>
          <span className="font-medium">{formatMoney(estimate.platformBase)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Features Selected</span>
          <span className="font-bold">{estimate.featuresSelected}</span>
        </div>
        <div className="flex justify-between items-center pt-2 mt-2 border-t border-border/30">
          <span className="text-muted-foreground">Monthly Run Cost (Base)</span>
          <span className="font-bold">{formatMoney(estimate.monthlyRunCost)}/mo</span>
        </div>
      </div>

      {aiEfficiency > 0 && (
        <div className="mb-8 bg-accent/5 p-4 rounded-lg border border-accent/20">
          <h4 className="text-xs text-foreground font-bold uppercase mb-4 text-center">AI Workload Optimization</h4>
          
          <div className="flex justify-between items-end mb-2 text-xs">
            <div className="text-muted-foreground flex flex-col">
              <span>Traditional Execution</span>
              <span className="font-bold">{100 - aiEfficiency}% Human</span>
            </div>
            <div className="text-[#c18b43] flex flex-col text-right">
              <span className="font-bold">Barakode Augmented</span>
              <span className="font-bold">{aiEfficiency}% AI Support</span>
            </div>
          </div>
          
          <div className="h-2 w-full flex rounded-full overflow-hidden">
            <motion.div
               className="h-full bg-muted-foreground/30"
               initial={{ width: '100%' }}
               animate={{ width: `${100 - aiEfficiency}%` }}
               transition={{ duration: 0.5 }}
            />
            <motion.div
               className="h-full bg-[#c18b43]"
               initial={{ width: 0 }}
               animate={{ width: `${aiEfficiency}%` }}
               transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="group relative w-full mb-2">
          <button 
            onClick={() => setIsCompareModalOpen(true)}
            disabled={!selectedPlatform}
            className="w-full flex items-center justify-center gap-2 border border-border hover:bg-accent/5 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GitCompare className="w-4 h-4" />
            COMPARE MVP vs FULL BUILD
          </button>
          {!selectedPlatform && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              Select a platform first
            </span>
          )}
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-[#c18b43] text-white hover:bg-[#86602c] py-3 rounded-lg font-bold transition-colors">
          <Download className="w-4 h-4" />
          EXPORT REPORT
        </button>
        <button 
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 border border-border hover:bg-accent/5 py-3 rounded-lg font-bold transition-all relative"
        >
          <Share className="w-4 h-4" />
          {copied ? "LINK COPIED! 📋" : "SHARE CALCULATION"}
        </button>
      </div>
      <CompareModal 
        isOpen={isCompareModalOpen} 
        onClose={() => setIsCompareModalOpen(false)} 
      />    </div>
  )
}
