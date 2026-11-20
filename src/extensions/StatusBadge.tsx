/** Optional primitive to demonstrate the Storybook -> exporter path for NEW components. */
export interface StatusBadgeProps {
  /** Short status message. */
  label: string;
  /** Visual status state. */
  status: 'info' | 'success' | 'warning';
}

export function StatusBadge({ label, status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status}`}>{label}</span>;
}
