import { create } from 'zustand';
import { Platform, Feature, AddOn } from '../lib/featureData';
import { calculateProjectEstimate, ProjectEstimate } from '../lib/projectCalculations';
import { CurrencyCode } from '../lib/currencyConfig';

interface ProjectStore {
  hourlyRate: number;
  industry: string;
  aiEfficiency: number;
  selectedPlatform: Platform | null;
  selectedFeatures: Feature[];
  selectedAddOns: AddOn[];
  estimate: ProjectEstimate | null;
  selectedCurrency: CurrencyCode;

  setHourlyRate: (rate: number) => void;
  setIndustry: (industry: string) => void;
  setAiEfficiency: (pct: number) => void;
  selectPlatform: (platform: Platform) => void;
  toggleFeature: (feature: Feature) => void;
  toggleAddOn: (addOn: AddOn) => void;
  setCurrency: (currency: CurrencyCode) => void;
  updateEstimate: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  hourlyRate: 100,
  industry: '',
  aiEfficiency: 35,
  selectedPlatform: null,
  selectedFeatures: [],
  selectedAddOns: [],
  estimate: null,
  selectedCurrency: 'USD',

  setHourlyRate: (rate) => {
    set({ hourlyRate: rate });
    get().updateEstimate();
  },
  setIndustry: (industry) => {
    set({ industry });
  },
  setAiEfficiency: (aiEfficiency) => {
    set({ aiEfficiency });
    get().updateEstimate();
  },
  selectPlatform: (platform) => {
    set({ selectedPlatform: platform });
    get().updateEstimate();
  },
  toggleFeature: (feature) => {
    set((state) => {
      const exists = state.selectedFeatures.some(f => f.id === feature.id);
      return {
        selectedFeatures: exists
          ? state.selectedFeatures.filter(f => f.id !== feature.id)
          : [...state.selectedFeatures, feature]
      };
    });
    get().updateEstimate();
  },
  toggleAddOn: (addOn) => {
    set((state) => {
      const exists = state.selectedAddOns.some(a => a.id === addOn.id);
      return {
        selectedAddOns: exists
          ? state.selectedAddOns.filter(a => a.id !== addOn.id)
          : [...state.selectedAddOns, addOn]
      };
    });
    get().updateEstimate();
  },
  setCurrency: (currency) => {
    set({ selectedCurrency: currency });
  },
  updateEstimate: () => {
    const { hourlyRate, aiEfficiency, selectedPlatform, selectedFeatures, selectedAddOns } = get();
    if (!selectedPlatform && selectedFeatures.length === 0 && selectedAddOns.length === 0) {
      set({ estimate: null });
      return;
    }
    const estimate = calculateProjectEstimate({
      hourlyRate,
      aiEfficiency,
      platform: selectedPlatform || { id: 'none', name: 'None', cost: 0, timeWeeks: 0 },
      selectedFeatures,
      selectedAddOns
    });
    set({ estimate });
  }
}));
