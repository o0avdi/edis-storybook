export interface MetricLabelProps {
  /** Short caption shown above the value, e.g. "Spent this month". */
  label: string;
  /** The number to display. Percent values are given as 0–100. */
  value: number;
  /** How the value is formatted (US English locale; currency is USD). */
  format?: 'number' | 'currency' | 'percent';
  /** Optional color hint for the value. */
  trend?: 'neutral' | 'positive' | 'negative';
}

const FORMATTERS = {
  number: new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }),
  currency: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 0 }),
  percent: new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 }),
};

/**
 * A labeled numeric value (a single KPI). A flat, atomic primitive: one caption and one formatted
 * number, with no children, callbacks or nested data, so its Storybook metadata maps cleanly to A2UI.
 */
export function MetricLabel({ label, value, format = 'number', trend = 'neutral' }: MetricLabelProps) {
  const display = FORMATTERS[format].format(format === 'percent' ? value / 100 : value);
  return (
    <div className={`metric-label metric-label--${trend}`}>
      <span className="metric-label__label">{label}</span>
      <span className="metric-label__value">{display}</span>
    </div>
  );
}
