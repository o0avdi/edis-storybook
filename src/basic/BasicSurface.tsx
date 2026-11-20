import { useEffect, useMemo, useState } from 'react';
import { A2uiSurface, MarkdownContext, type ReactCatalogComponent } from '@a2ui/react';
import { renderMarkdown } from '@a2ui/markdown-it';
import { basicCatalog } from '@a2ui/web_core/catalogs/basic/v1';
import {
  MessageProcessor,
  STRICT_VALIDATION,
  type ActionPayload,
  type SurfaceModel,
} from '@a2ui/web_core/v1_0';

/** Uses SDK-owned Basic Catalog implementations. This is not a copy of a React design system. */
export function BasicSurface({
  message,
  onAction,
}: {
  message: unknown;
  onAction?: (action: ActionPayload) => void;
}) {
  const serialized = JSON.stringify(message);
  const stableMessage = useMemo(() => JSON.parse(serialized) as unknown, [serialized]);
  const [surface, setSurface] = useState<SurfaceModel<ReactCatalogComponent> | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState<ActionPayload | null>(null);

  useEffect(() => {
    const processor = new MessageProcessor<ReactCatalogComponent>(
      [basicCatalog],
      (action) => {
        setLastAction(action);
        onAction?.(action);
      },
      { validationConfig: STRICT_VALIDATION },
    );
    const issues = processor.processMessagesWithErrors([stableMessage]);
    setErrors(issues.map(({ error }) => error.message));
    setSurface([...processor.getSurfaces().values()][0] ?? null);
    return () => processor.dispose();
  }, [stableMessage, onAction]);

  return (
    <div className="basic-preview">
      <MarkdownContext.Provider value={renderMarkdown}>
        {errors.length > 0 ? (
          <pre className="error">SDK validation rejected this surface:\n{errors.join('\n')}</pre>
        ) : surface ? (
          <div className="a2ui-stage"><A2uiSurface surface={surface} /></div>
        ) : (
          <p>Preparing preview…</p>
        )}
      </MarkdownContext.Provider>
      {lastAction && <pre className="action-log">Action: {JSON.stringify(lastAction, null, 2)}</pre>}
    </div>
  );
}
