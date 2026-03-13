import { create } from 'zustand';
import { RoleSelection, TeamEstimate, calculateTeamEstimate } from '../lib/teamCalculations';

export const defaultRoles: RoleSelection[] = [
  { id: 'r1', name: 'Senior Developer', inHouseSalary: 145000, quantity: 0 },
  { id: 'r2', name: 'Mid-Level Developer', inHouseSalary: 105000, quantity: 0 },
  { id: 'r3', name: 'Junior Developer', inHouseSalary: 75000, quantity: 0 },
  { id: 'r4', name: 'UI/UX Designer', inHouseSalary: 95000, quantity: 0 },
  { id: 'r5', name: 'Product Manager', inHouseSalary: 115000, quantity: 0 },
  { id: 'r6', name: 'QA Engineer', inHouseSalary: 85000, quantity: 0 },
  { id: 'r7', name: 'AI/ML Engineer', inHouseSalary: 165000, quantity: 0 },
];

interface TeamStore {
  roles: RoleSelection[];
  duration: number;
  masterRate: number;
  funding: number;
  ventureMode: 'bootstrap' | 'startup_equity';
  exitVal: number | null;
  estimate: TeamEstimate | null;

  updateRoleQuantity: (roleId: string, quantity: number) => void;
  setDuration: (months: number) => void;
  setMasterRate: (rate: number) => void;
  setFunding: (amount: number) => void;
  setVentureMode: (mode: 'bootstrap' | 'startup_equity') => void;
  setExitVal: (val: number | null) => void;
  updateEstimate: () => void;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  roles: defaultRoles,
  duration: 12,
  masterRate: 45,
  funding: 500000,
  ventureMode: 'bootstrap',
  exitVal: null,
  estimate: null,

  updateRoleQuantity: (roleId, quantity) => {
    set((state) => ({
      roles: state.roles.map(r => r.id === roleId ? { ...r, quantity: Math.max(0, quantity) } : r)
    }));
    get().updateEstimate();
  },
  setDuration: (months) => {
    set({ duration: months });
    get().updateEstimate();
  },
  setMasterRate: (rate) => {
    set({ masterRate: rate });
    get().updateEstimate();
  },
  setFunding: (amount) => {
    set({ funding: Math.max(0, amount) });
    get().updateEstimate();
  },
  setVentureMode: (mode) => {
    set({ ventureMode: mode });
    get().updateEstimate();
  },
  setExitVal: (val) => {
    set({ exitVal: val });
    get().updateEstimate();
  },
  updateEstimate: () => {
    const { roles, duration, masterRate, funding, ventureMode, exitVal } = get();
    // If no roles are selected, we can still show 0s or we can calculate it (it returns 0s)
    const estimate = calculateTeamEstimate({
      roles,
      duration,
      masterRate,
      funding,
      ventureMode,
      exitVal
    });
    set({ estimate });
  }
}));
