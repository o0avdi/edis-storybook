export interface StatusBadgeProps {
  /** Short status message. */
  label: string;
  /** Visual status state. */
  status: 'info' | 'success' | 'warning';
}

/**
 * A compact pill that labels a status. The original example primitive for the Storybook → exporter path.
 */
export function StatusBadge({ label, status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status}`}>{label}</span>;
}
