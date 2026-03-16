import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Info, Lightbulb } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { formatCurrency } from "@/lib/currencyConfig";
import { calculateMVPEstimate, getComparisonSummary } from "@/lib/comparisonCalculations";
import { Feature, Platform } from "@/lib/featureData";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompareModal({ isOpen, onClose }: CompareModalProps) {
  const store = useProjectStore();

  if (!isOpen || !store.estimate) return null;

  // Re-build "inputs" from the current store to pass to recalculator
  const defaultPlatform = { id: 'none', name: 'None', cost: 0, timeWeeks: 0 } as Platform;
  const inputs = {
    platform: store.selectedPlatform || defaultPlatform,
    selectedFeatures: store.selectedFeatures,
    selectedAddOns: store.selectedAddOns,
    aiEfficiency: store.aiEfficiency,
    hourlyRate: store.hourlyRate,
  };

  const mvpEstimate = calculateMVPEstimate(inputs);
  const fullEstimate = store.estimate;
  const summary = getComparisonSummary(mvpEstimate, fullEstimate, store.selectedFeatures);

  const formatMoney = (val: number) => {
    return formatCurrency(val, store.selectedCurrency);
  }

  const allFeatures = store.selectedFeatures;
  const mvpFeatures = summary.mvpFeatures;
  const mvpFeatureIds = new Set(mvpFeatures.map((f: Feature) => f.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-muted/30">
            <div>
              <h2 className="text-xl font-bold">MVP vs Full Build Comparison</h2>
              <p className="text-sm text-muted-foreground">Based on your current configuration</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-accent/10 rounded-full transition-colors">
              <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">
            <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px bg-border/50 -translate-x-1/2"></div>
            
            {/* MVP Column */}
            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-2xl font-black text-primary">MVP BUILD</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">(Phase 1 Launch)</p>
              </div>

              <div className="space-y-3 p-5 rounded-xl bg-accent/5 border border-accent/20">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Total Cost</span>
                  <span className="font-bold text-lg">{formatMoney(mvpEstimate.totalEstimatedCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Time</span>
                  <span className="font-medium text-sm">~{mvpEstimate.estimatedWeeks} Wks / ~{mvpEstimate.estimatedMonths.toFixed(1)} Mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Monthly Run</span>
                  <span className="font-medium text-sm">{formatMoney(mvpEstimate.monthlyRunCost)}/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Features</span>
                  <span className="font-medium text-sm">{mvpEstimate.featuresSelected}</span>
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  <span className="h-px bg-border flex-1"></span>
                  Included Features
                  <span className="h-px bg-border flex-1"></span>
                </h4>
                <ul className="space-y-2 text-sm">
                  {mvpFeatures.length === 0 ? (
                    <li className="text-muted-foreground text-center italic py-2">No core features selected</li>
                  ) : (
                    mvpFeatures.map(f => (
                      <li key={f.id} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">&bull;</span>
                        <span>{f.name}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* FULL BUILD Column */}
            <div className="space-y-6 opacity-90">
              <div className="mb-4">
                <h3 className="text-2xl font-black">FULL BUILD</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">(Your Configuration)</p>
              </div>

              <div className="space-y-3 p-5 rounded-xl border border-border/50 bg-background/50">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Total Cost</span>
                  <span className="font-bold text-lg">{formatMoney(fullEstimate.totalEstimatedCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Time</span>
                  <span className="font-medium text-sm">~{fullEstimate.estimatedWeeks} Wks / ~{fullEstimate.estimatedMonths.toFixed(1)} Mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Monthly Run</span>
                  <span className="font-medium text-sm">{formatMoney(fullEstimate.monthlyRunCost)}/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Features</span>
                  <span className="font-medium text-sm">{fullEstimate.featuresSelected}</span>
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  <span className="h-px bg-border flex-1"></span>
                  All Your Features
                  <span className="h-px bg-border flex-1"></span>
                </h4>
                <ul className="space-y-2 text-sm">
                  {allFeatures.length === 0 && store.selectedAddOns.length === 0 ? (
                    <li className="text-muted-foreground text-center italic py-2">No features selected</li>
                  ) : (
                    <>
                      {allFeatures.map(f => {
                        const inMvp = mvpFeatureIds.has(f.id);
                        return (
                          <li key={f.id} className={inMvp ? "flex flex-col mb-1.5" : "flex flex-col mb-1.5 opacity-60"}>
                            <div className="flex items-start gap-2">
                              <span className={inMvp ? "text-primary mt-0.5" : "text-muted-foreground mt-0.5"}>&bull;</span>
                              <span className={inMvp ? "font-medium" : ""}>{f.name}</span>
                            </div>
                            {!inMvp && (
                              <span className="text-xs text-muted-foreground ml-4 pl-1">(Deferred in MVP)</span>
                            )}
                          </li>
                        )
                      })}
                      {store.selectedAddOns.map(a => (
                        <li key={a.id} className="flex flex-col mb-1.5 opacity-60">
                          <div className="flex items-start gap-2">
                              <span className="text-muted-foreground mt-0.5">&bull;</span>
                            <span>{a.name} <span className="text-xs border border-border px-1 rounded">Add-On</span></span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-4 pl-1">(Deferred in MVP)</span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
            <div className="border-t border-border bg-muted/20 p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="text-sm font-medium bg-primary/10 text-primary-foreground border border-primary/20 px-4 py-3 rounded-lg w-full md:w-auto">
                {allFeatures.length === 0 && store.selectedAddOns.length === 0 ? (
                    "No features selected yet &mdash; add features to see MVP savings."
                ) : summary.isMVPSameAsFull ? (
                  <span className="text-foreground flex items-start gap-2">
                      <span className="text-xl leading-none">
                        <Info className="w-5 h-5 text-primary shrink-0" />
                      </span>
                      <span>
                        All your selected features are advanced-tier.<br/>
                        <span className="opacity-80 font-normal">There is no smaller MVP scope within your current selection. Consider adding more foundational features to enable a phased launch.</span>
                      </span>
                    </span>
                  ) : (
                    <span className="text-foreground flex items-start gap-2">
                      <span className="text-xl leading-none">
                        <Lightbulb className="w-5 h-5 text-primary shrink-0" />
                      </span>
                    <span>
                      {mvpFeatures.length > 0 && mvpFeatures[0].tier !== "core" && (
                        <>None of your selected features are launch-critical by default.<br/>This MVP is based on your recommended-tier selections.<br/></>
                      )}
                      
                      {mvpFeatures.length > 0 && mvpFeatures[0].tier !== "core" ? (
                        <>Deferring the rest saves you <strong className="text-primary">{formatMoney(summary.costSaved)}</strong> and <strong>{summary.weeksSaved} weeks</strong>.</>
                      ) : (
                        <>
                          Launching MVP first saves you <strong className="text-primary">{formatMoney(summary.costSaved)}</strong> and <strong>{summary.weeksSaved} weeks</strong>.<br/>
                          <span className="opacity-80 font-normal">You can add the remaining {summary.deferredFeaturesCount + store.selectedAddOns.length} features & add-ons in Phase 2.</span>
                        </>
                      )}
                    </span>
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <button 
                  onClick={onClose}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-lg border border-border hover:bg-accent/5 font-bold text-sm transition-colors"
                >
                  CLOSE
                </button>
                {!summary.isMVPSameAsFull && (
                <button 
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#c18b43] text-white hover:bg-[#86602c] px-6 py-2.5 rounded-lg font-bold text-sm transition-colors"
                  onClick={() => {
                    alert("MVP Estimate Ready to Export (Connect to email modal)")
                  }}
                >
                  <Download className="w-4 h-4" />
                  EXPORT MVP ESTIMATE
                </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }
