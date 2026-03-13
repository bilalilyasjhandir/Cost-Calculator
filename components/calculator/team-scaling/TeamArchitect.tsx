"use client"

import { useTeamStore } from "@/store/teamStore"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Plus, Minus, User } from "lucide-react"

export function TeamArchitect() {
  const { roles, updateRoleQuantity, masterRate } = useTeamStore()

  const formatK = (val: number) => `$${(val / 1000).toFixed(0)}k`

  return (
    <Card className="flex flex-col border-border bg-card w-full overflow-hidden">
      <div className="p-4 border-b border-border flex items-center gap-2 bg-muted/30">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <User className="w-4 h-4" /> TEAM ARCHITECT
        </h3>
      </div>
      <div className="flex flex-col">
        {roles.map((role) => {
          const isSelected = role.quantity > 0;
          return (
            <div
              key={role.id}
              className={cn(
                "flex flex-col p-4 border-b border-border/50 last:border-b-0 transition-colors",
                isSelected ? "bg-accent/5 relative" : "bg-transparent hover:bg-muted/20"
              )}
            >
              {isSelected && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent" />}
              
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-sm text-foreground">{role.name}</span>
                <span className="text-xs text-muted-foreground">{formatK(role.inHouseSalary)} in-house</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center bg-background border border-border/50 text-xs text-muted-foreground px-2.5 py-1.5 rounded font-mono">
                  $ {masterRate} <span className="opacity-50 ml-1">/hr</span>
                </div>

                <div className="flex items-center bg-background border border-border/50 rounded-md p-0.5">
                  <button
                    onClick={() => updateRoleQuantity(role.id, role.quantity - 1)}
                    disabled={role.quantity === 0}
                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted disabled:opacity-30 text-foreground transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-6 text-center text-sm font-bold">
                    {role.quantity}
                  </div>
                  <button
                    onClick={() => updateRoleQuantity(role.id, role.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted text-foreground transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
