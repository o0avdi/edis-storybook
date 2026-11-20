export interface ProgressIndicatorProps {
  /** Accessible name and visible caption, e.g. "Dining out budget used". */
  label: string;
  /** Current amount. Values outside 0…max are clamped for display. */
  value: number;
  /** Amount that represents 100%. */
  max?: number;
  /** Color of the filled bar. */
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  /** Show the "value / max" readout next to the label. */
  showValue?: boolean;
}

/**
 * A horizontal progress bar with a caption, exposed to assistive technology as `role="progressbar"`.
 * Atomic and display-only: numeric value/max, an enum tone and a boolean, all flat scalar props.
 */
export function ProgressIndicator({ label, value, max = 100, tone = 'neutral', showValue = true }: ProgressIndicatorProps) {
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const percent = Math.round((clamped / safeMax) * 100);
  return (
    <div className={`progress progress--${tone}`}>
      <div className="progress__header">
        <span className="progress__label">{label}</span>
        {showValue && (
          <span className="progress__value">
            {value} / {safeMax} · {percent}%
          </span>
        )}
      </div>
      <div
        className="progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamped}
        aria-valuetext={`${percent}%`}
      >
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
