export interface RoleSelection {
  id: string;
  name: string;
  inHouseSalary: number;
  quantity: number;
}

export interface TeamInputs {
  roles: RoleSelection[];
  duration: number;
  masterRate: number;
  funding: number;
  ventureMode: 'bootstrap' | 'startup_equity';
  exitVal: number | null;
}

export interface TeamEstimate {
  inHouseTotal: number;
  staffAugTotal: number;
  barakodeTotal: number;
  inHouseMonthlyBurn: number;
  barakodeMonthlyBurn: number;
  inHouseRunway: number;
  barakodeRunway: number;
  runwayGainMonths: number;
  survivalExtensionPercent: number;
  capitalPreserved: number;
  monthlyRetention: number;
  equityDilutionPrevented: number | null;
}

export function calculateTeamEstimate(inputs: TeamInputs): TeamEstimate {
  const { roles, duration, masterRate, funding, ventureMode, exitVal } = inputs;

  const hoursPerMonth = 160;  // standard full-time hours
  const overheadMultiplier = 1.3;   // 30% overhead (taxes, benefits, equipment)
  const agencyMarkup = 1.5;         // 50% agency markup
  const aiEfficiencyDiscount = 0.4; // Barakode costs 60% less than standard hourly

  // In-House total cost
  const inHouseMonthlyCost = roles.reduce((sum, r) => {
    const annualSalary = r.inHouseSalary;
    const monthlySalary = annualSalary / 12;
    return sum + (monthlySalary * overheadMultiplier * r.quantity);
  }, 0);
  const inHouseTotal = inHouseMonthlyCost * duration;

  // Staff Aug total cost
  const staffAugMonthlyCost = roles.reduce((sum, r) => {
    return sum + (r.quantity * masterRate * hoursPerMonth * agencyMarkup);
  }, 0);
  const staffAugTotal = staffAugMonthlyCost * duration;

  // Barakode Team total cost
  const barakodeMonthlyCost = roles.reduce((sum, r) => {
    return sum + (r.quantity * masterRate * hoursPerMonth * aiEfficiencyDiscount);
  }, 0);
  const barakodeTotal = barakodeMonthlyCost * duration;

  // Runway calculations
  const safeFunding = funding || 0;
  const inHouseRunway = inHouseMonthlyCost > 0 ? safeFunding / inHouseMonthlyCost : Number.POSITIVE_INFINITY;
  const barakodeRunway = barakodeMonthlyCost > 0 ? safeFunding / barakodeMonthlyCost : Number.POSITIVE_INFINITY;
  
  let survivalExtensionPercent = 0;
  if (inHouseRunway > 0 && inHouseRunway !== Number.POSITIVE_INFINITY && barakodeRunway !== Number.POSITIVE_INFINITY) {
    survivalExtensionPercent = ((barakodeRunway - inHouseRunway) / inHouseRunway) * 100;
  }

  // Capital preserved
  const capitalPreserved = inHouseTotal - barakodeTotal;
  const monthlyRetention = duration > 0 ? capitalPreserved / duration : 0;

  // Equity calculations — only meaningful when ventureMode === 'startup_equity' and exitVal is set
  let equityDilutionPrevented: number | null = null;
  if (ventureMode === 'startup_equity' && exitVal && exitVal > 0) {
    const exitValInDollars = exitVal * 1_000_000;  // exitVal is entered in millions
    equityDilutionPrevented = (capitalPreserved / exitValInDollars) * 100;
  }

  return {
    inHouseTotal,
    staffAugTotal,
    barakodeTotal,
    inHouseMonthlyBurn: inHouseMonthlyCost,
    barakodeMonthlyBurn: barakodeMonthlyCost,
    inHouseRunway,
    barakodeRunway,
    runwayGainMonths: barakodeRunway !== Number.POSITIVE_INFINITY && inHouseRunway !== Number.POSITIVE_INFINITY ? barakodeRunway - inHouseRunway : 0,
    survivalExtensionPercent,
    capitalPreserved,
    monthlyRetention,
    equityDilutionPrevented,
  };
}
