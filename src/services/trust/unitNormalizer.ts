export interface NormalizedMetric {
  standardValue: number;
  standardUnit: string;
  originalValue: number;
  originalUnit: string;
}

export interface MetricComparison {
  claimed: NormalizedMetric;
  observed: NormalizedMetric;
  absoluteDiff: number;
  relativeDiffPct: number;
  isCloseMatch: boolean;
  isSubstantialMismatch: boolean;
}

// 1. Normalize Length / Depth to Metres (m)
export function normalizeDepth(value: number, unit: string): NormalizedMetric {
  const u = unit.toLowerCase().trim();
  let mValue = value;
  if (u === "cm" || u === "सेमी") mValue = value / 100;
  else if (u === "mm" || u === "मिमी") mValue = value / 1000;
  else if (u === "ft" || u === "feet" || u === "फीट") mValue = value * 0.3048;

  return {
    standardValue: parseFloat(mValue.toFixed(2)),
    standardUnit: "m",
    originalValue: value,
    originalUnit: unit
  };
}

// 2. Normalize Precipitation to Millimetres (mm)
export function normalizePrecipitation(value: number, unit: string): NormalizedMetric {
  const u = unit.toLowerCase().trim();
  let mmValue = value;
  if (u === "cm" || u === "सेमी") mmValue = value * 10;
  else if (u === "in" || u === "inch" || u === "इंच") mmValue = value * 25.4;

  return {
    standardValue: parseFloat(mmValue.toFixed(1)),
    standardUnit: "mm",
    originalValue: value,
    originalUnit: unit
  };
}

// 3. Normalize Area to Acres
export function normalizeArea(value: number, unit: string): NormalizedMetric {
  const u = unit.toLowerCase().trim();
  let acreValue = value;
  if (u === "ha" || u === "hectare" || u === "हेक्टर") acreValue = value * 2.47105;
  else if (u === "guntha" || u === "गुंठा") acreValue = value / 40;

  return {
    standardValue: parseFloat(acreValue.toFixed(2)),
    standardUnit: "acre",
    originalValue: value,
    originalUnit: unit
  };
}

// 4. Compare Claimed vs Observed Metrics with Domain Tolerance Check
export function compareMetrics(
  claimed: NormalizedMetric,
  observed: NormalizedMetric,
  toleranceConfig: { absoluteMaxDiff: number; relativeMaxPct: number }
): MetricComparison {
  const absoluteDiff = parseFloat(Math.abs(claimed.standardValue - observed.standardValue).toFixed(2));
  const baseDenominator = Math.max(observed.standardValue, 0.1);
  const relativeDiffPct = parseFloat(((absoluteDiff / baseDenominator) * 100).toFixed(1));

  const isCloseMatch =
    absoluteDiff <= toleranceConfig.absoluteMaxDiff || relativeDiffPct <= toleranceConfig.relativeMaxPct;

  const isSubstantialMismatch =
    absoluteDiff > toleranceConfig.absoluteMaxDiff * 2 && relativeDiffPct > toleranceConfig.relativeMaxPct * 1.5;

  return {
    claimed,
    observed,
    absoluteDiff,
    relativeDiffPct,
    isCloseMatch,
    isSubstantialMismatch
  };
}
