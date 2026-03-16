"use client"

import { useProjectStore } from "@/store/projectStore"
import { projectFeatures, projectAddOns } from "@/lib/featureData"
import { getMVPFeatures } from "@/lib/comparisonCalculations"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function FeaturesSection() {
  const { selectedPlatform, selectedFeatures, toggleFeature, selectedAddOns, toggleAddOn } = useProjectStore()

  if (!selectedPlatform) return null

  const mvpFeatureIds = new Set(getMVPFeatures(selectedFeatures).map(f => f.id))

  // Group features by category
  const categories = Array.from(new Set(projectFeatures.map(f => f.category)))

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="space-y-10 overflow-hidden px-1 -mx-1"
      >
        <div className="space-y-8">
          <h3 className="text-2xl font-bold border-b border-border pb-2">Features</h3>
          {categories.map(category => {
            const features = projectFeatures.filter(f => f.category === category)
            return (
              <div key={category} className="space-y-4">
                <h4 className="text-lg font-medium text-muted-foreground">{category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {features.map(feature => {
                    const isSelected = selectedFeatures.some(f => f.id === feature.id)
                    return (
                      <Card
                        key={feature.id}
                        className={cn(
                          "relative p-4 cursor-pointer transition-all hover:bg-accent/5 pt-6",
                          isSelected ? "border-accent bg-accent/5" : "border-border bg-card"
                        )}
                        onClick={() => toggleFeature(feature)}
                      >
                        {isSelected && mvpFeatureIds.has(feature.id) && (
                          <div className="absolute top-0 left-0 bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-br-md border-r border-b border-primary/20">
                            MVP
                          </div>
                        )}
                        <div className="flex justify-between items-start gap-2">
                          <span className={cn("font-medium text-sm leading-tight", isSelected ? "text-foreground" : "text-muted-foreground")}>
                            {feature.name}
                          </span>
                          {feature.runCost && (
                            <Badge variant="secondary" className="text-[10px] whitespace-nowrap bg-muted">
                              ${feature.runCost}/mo
                            </Badge>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="space-y-6 pt-6 border-t border-border">
          <h3 className="text-2xl font-bold">Add-Ons</h3>
          <div className="flex flex-wrap gap-4">
            {projectAddOns.map(addon => {
              const isSelected = selectedAddOns.some(a => a.id === addon.id)
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddOn(addon)}
                  className={cn(
                    "flex flex-col text-left px-5 py-3 rounded-xl border transition-all",
                    isSelected 
                      ? "border-accent bg-accent/10 border-2" 
                      : "border-border bg-card hover:border-muted-foreground"
                  )}
                >
                  <span className="font-bold">{addon.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    +${addon.buildCost.toLocaleString()} | ${addon.opEx}/mo
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}