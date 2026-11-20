import { useCallback, useState } from 'react';
import type { ActionPayload } from '@a2ui/web_core/v1_0';
import { BasicSurface } from '../basic/BasicSurface';
import { JsonView } from '../basic/JsonView';
import { componentCounts, type CreateSurfaceMessage } from '../basic/messages';
import { budgetReply } from './budget';

/**
 * Presentation shell for the budget example. The dashboard itself is ONLY the `createSurface`
 * message from `budgetReply()`, rendered by the SDK. Button events go to the deterministic
 * sample logic (standing in for an agent turn) and, when provided, to Storybook's Actions panel.
 */
export function BudgetSurface({ onAction }: { onAction?: (eventName: string, payload: ActionPayload) => void }) {
  const [message, setMessage] = useState<CreateSurfaceMessage>(() => budgetReply());
  const [showJson, setShowJson] = useState(false);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  const handleAction = useCallback(
    (action: ActionPayload) => {
      onAction?.(action.name, action);
      setLastEvent(action.name);
      setMessage(budgetReply({ name: action.name, context: action.context }));
    },
    [onAction],
  );

  const counts = componentCounts(message);
  const total = message.createSurface.components.length;

  return (
    <div className={`composition ${showJson ? 'composition--with-json' : ''}`}>
      <header className="composition__header">
        <p className="eyebrow">Composed example · deterministic sample, not a live model call</p>
        <h1 className="composition__title">One createSurface message, only Basic Catalog primitives</h1>
        <p className="lede">
          No <code>BudgetDashboard</code> component exists: {total} component entries adapted from the showcase&rsquo;s{' '}
          <code>budget-sample.ts</code>, rendered by the official SDK.
        </p>
        <ul className="chips" aria-label="Components used in this message">
          {counts.map(([name, count]) => (
            <li key={name}>
              <code>{name}</code> × {count}
            </li>
          ))}
        </ul>
      </header>

      <div className="composition__body">
        <section className="stage stage--sdk composition__surface" aria-label="Rendered budget surface">
          <header className="stage__caption stage__caption--toolbar">
            <span className="dot dot--sdk" aria-hidden />
            <span>
              Official A2UI SDK render · surface <code>november-budget</code>
            </span>
            <span className="stage__status" aria-live="polite">
              {lastEvent ? (
                <>
                  Last event → sample logic: <code>{lastEvent}</code>
                </>
              ) : (
                'Try a category button or “Edit amounts”'
              )}
            </span>
            <button type="button" className="btn btn--small" aria-pressed={showJson} onClick={() => setShowJson((previous) => !previous)}>
              {showJson ? 'Hide createSurface JSON' : 'Show createSurface JSON'}
            </button>
          </header>
          <div className="stage__body">
            <BasicSurface message={message} onAction={handleAction} />
          </div>
        </section>
        {showJson && (
          <JsonView value={message} title="createSurface message" caption="regenerated after each event" maxHeight="calc(100vh - 160px)" />
        )}
      </div>
    </div>
  );
}
