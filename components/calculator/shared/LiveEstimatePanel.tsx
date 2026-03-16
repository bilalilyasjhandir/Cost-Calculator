"use client"

import { useProjectStore } from "@/store/projectStore"
import { motion } from "framer-motion"
import { useState } from "react"
import { Share, Download } from "lucide-react"

export function LiveEstimatePanel() {
  const { estimate, aiEfficiency } = useProjectStore()
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    // Dummy handler for now, spec says Next Step
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format dollars safely
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0)

  if (!estimate) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 sticky top-6 opacity-50 text-center">
        <p className="text-muted-foreground">Select a platform and features to see your live estimate.</p>
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
          <h4 className="text-xs text-foreground font-bold uppercase mb-3 text-center">AI Workload Optimization</h4>
          <div className="space-y-3 text-xs font-medium">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Traditional Execution</span>
                <span className="text-foreground">100% Human</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-muted-foreground/30 w-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#c18b43] font-bold">Barakode Augmented</span>
                <span className="text-[#c18b43] font-bold">{aiEfficiency}% AI Support</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                   className="h-full bg-[#c18b43]"
                   initial={{ width: 0 }}
                   animate={{ width: `${aiEfficiency}%` }}
                   transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
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

    </div>
  )
}
