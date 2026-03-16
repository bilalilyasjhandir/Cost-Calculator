"use client"

import { useProjectStore } from "@/store/projectStore"
import { platforms } from "@/lib/featureData"
import { formatCurrencyShort } from "@/lib/currencyConfig"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Smartphone, Monitor, MonitorSmartphone } from "lucide-react"

export function PlatformSelector() {
  const { selectedPlatform, selectPlatform, selectedCurrency } = useProjectStore()

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">Select Target Platform</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const isSelected = selectedPlatform?.id === platform.id
          
          return (
            <Card
              key={platform.id}
              className={cn(
                "p-6 cursor-pointer transition-all hover:border-accent duration-300",
                isSelected ? "border-accent bg-accent/5" : "border-border bg-card"
              )}
              onClick={() => selectPlatform(platform)}
            >
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className={cn(
                  "p-4 rounded-full transition-colors",
                  isSelected ? "bg-accent/10 text-accent" : "bg-muted/50 text-muted-foreground"
                )}>
                  {platform.id === 'mobile' && <Smartphone className="w-8 h-8" />}
                  {platform.id === 'web' && <Monitor className="w-8 h-8" />}
                  {platform.id === 'cross' && <MonitorSmartphone className="w-8 h-8" />}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{platform.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Starts at {formatCurrencyShort(platform.cost, selectedCurrency)}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
