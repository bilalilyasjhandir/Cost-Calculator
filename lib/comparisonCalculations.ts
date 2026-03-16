import { ProjectEstimate, ProjectInputs, calculateProjectEstimate } from './projectCalculations';
import { Feature } from './featureData';

export function getMVPFeatures(selectedFeatures: Feature[]): Feature[] {
  // Step 1: try core features from user's selection
  const coreFeatures = selectedFeatures.filter(f => f.tier === 'core');
  if (coreFeatures.length > 0) return coreFeatures;

  // Step 2: fallback — try recommended features from user's selection
  const recommendedFeatures = selectedFeatures.filter(f => f.tier === 'recommended');
  if (recommendedFeatures.length > 0) return recommendedFeatures;

  // Step 3: fallback — user only selected advanced features, MVP = Full Build
  return selectedFeatures;
}

export function calculateMVPEstimate(inputs: ProjectInputs): ProjectEstimate {
  const mvpFeatures = getMVPFeatures(inputs.selectedFeatures);

  return calculateProjectEstimate({
    ...inputs,
    selectedFeatures: mvpFeatures,
    selectedAddOns: [],
  });
}

export function getComparisonSummary(
  mvp: ProjectEstimate, 
  full: ProjectEstimate,
  selectedFeatures: Feature[]
) {
  const mvpFeatures = getMVPFeatures(selectedFeatures);
  const deferredFeatures = selectedFeatures.filter(
    f => !mvpFeatures.find(m => m.id === f.id)
  );

  return {
    costSaved: full.totalEstimatedCost - mvp.totalEstimatedCost,
    weeksSaved: full.estimatedWeeks - mvp.estimatedWeeks,
    deferredFeaturesCount: deferredFeatures.length,
    deferredFeatures,
    mvpFeatures,
    isMVPSameAsFull: mvpFeatures.length === selectedFeatures.length,
  };
}
