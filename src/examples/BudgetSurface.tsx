import { useCallback, useState } from 'react';
import type { ActionPayload } from '@a2ui/web_core/v1_0';
import { BasicSurface } from '../basic/BasicSurface';
import { budgetReply } from './budget';

/** The original budget UI is composed from official primitives via A2UI JSON. */
export function BudgetSurface() {
  const [message, setMessage] = useState<unknown>(() => budgetReply());
  const [showJson, setShowJson] = useState(false);
  const handleAction = useCallback((action: ActionPayload) => {
    setMessage(budgetReply({ name: action.name, context: action.context }));
  }, []);
  return (
    <div>
      <button type="button" className="json-toggle" onClick={() => setShowJson((previous) => !previous)}>
        {showJson ? 'Hide A2UI createSurface JSON' : 'Show A2UI createSurface JSON'}
      </button>
      <BasicSurface message={message} onAction={handleAction} />
      {showJson && <pre className="schema">{JSON.stringify(message, null, 2)}</pre>}
    </div>
  );
}
