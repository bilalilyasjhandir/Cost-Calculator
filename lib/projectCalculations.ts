import { Platform, Feature, AddOn } from './featureData';

export interface ProjectInputs {
  hourlyRate: number;
  aiEfficiency: number;
  platform: Platform;
  selectedFeatures: Feature[];
  selectedAddOns: AddOn[];
}

export interface ProjectEstimate {
  totalEstimatedCost: number;
  monthlyRunCost: number;
  platformBase: number;
  marketValue: number;
  youSave: number;
  featuresSelected: number;
  aiWorkloadPercent: number;
  estimatedWeeks: number;
  estimatedMonths: number;
}

export function calculateProjectEstimate(inputs: ProjectInputs): ProjectEstimate {
  const { hourlyRate, aiEfficiency, platform, selectedFeatures, selectedAddOns } = inputs;

  // Base costs
  const platformBase = platform ? platform.cost : 0;

  // Feature costs (each feature has a base hour estimate multiplied by hourly rate represented by cost at base $100)
  const featureCost = selectedFeatures.reduce((sum, f) => sum + f.cost, 0);

  // Add-on build costs
  const addOnCost = selectedAddOns.reduce((sum, a) => sum + a.buildCost, 0);

  // Raw total before AI discount (at baseline rate $100)
  const rawTotalAtBaseline = platformBase + featureCost + addOnCost;

  // Final raw cost adjusted for user's hourly rate
  const baseRate = 100;
  const rateMultiplier = hourlyRate / baseRate;
  const rawTotal = rawTotalAtBaseline * rateMultiplier;

  // Market value = what a traditional agency would charge (market is ~90% more expensive)
  const marketValue = rawTotal * 1.9;

  // AI efficiency discount
  const aiDiscount = rawTotal * (aiEfficiency / 100);

  const totalEstimatedCost = rawTotal - aiDiscount;

  const hasPlatform = platform && platform.id !== 'none';
  
  // Time calculations
  const platformBaseWeeks = hasPlatform ? platform.timeWeeks : 0;
  const featureWeeks = selectedFeatures.reduce((sum, f) => sum + f.timeWeeks, 0);
  const addOnWeeks = selectedAddOns.reduce((sum, a) => sum + (a.timeWeeks || 0), 0);
  
  const rawWeeks = platformBaseWeeks + featureWeeks + addOnWeeks;
  const aiTimeDiscount = rawWeeks * (aiEfficiency / 100);
  const adjustedWeeks = rawWeeks - aiTimeDiscount;
  
  // Always be conservative: Math.ceil for weeks, round months to 1 decimal point. If a platform is selected, minimum time ensures we display realistic delivery rather than zero. 
  const displayWeeks = hasPlatform ? Math.max(1, Math.ceil(adjustedWeeks)) : 0;
  const displayMonths = hasPlatform ? Math.max(0.2, parseFloat((adjustedWeeks / 4.33).toFixed(1))) : 0;

  // Monthly run cost
  const monthlyRunCost = selectedFeatures
    .filter(f => f.runCost)
    .reduce((sum, f) => sum + (f.runCost || 0), 0)
    + selectedAddOns.reduce((sum, a) => sum + a.opEx, 0);

  const youSave = marketValue - totalEstimatedCost;

  return {
    totalEstimatedCost,
    monthlyRunCost,
    platformBase: platformBase * rateMultiplier,
    marketValue,
    youSave,
    featuresSelected: selectedFeatures.length,
    aiWorkloadPercent: aiEfficiency * 1.05,
    estimatedWeeks: displayWeeks,
    estimatedMonths: displayMonths,
  };
}
