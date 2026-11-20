import { useEffect, useMemo, useRef, useState } from 'react';
import { A2uiSurface, MarkdownContext, type ReactCatalogComponent } from '@a2ui/react';
import { renderMarkdown } from '@a2ui/markdown-it';
import { basicCatalog } from '@a2ui/web_core/catalogs/basic/v1';
import {
  MessageProcessor,
  STRICT_VALIDATION,
  type ActionPayload,
  type SurfaceModel,
} from '@a2ui/web_core/v1_0';
import type { CreateSurfaceMessage } from './messages';

export type BasicSurfaceProps = {
  /** The A2UI `createSurface` message handed to the SDK `MessageProcessor`. */
  message: CreateSurfaceMessage;
  /** Receives SDK action payloads (Button events). Stories pass a Storybook `fn()` spy here. */
  onAction?: (action: ActionPayload) => void;
  /** Data-model paths to display live, so viewers can see two-way bindings update. */
  watch?: readonly string[];
};

/**
 * INTERNAL preview harness. It feeds an A2UI message to the SDK's own `MessageProcessor`
 * (strict validation, official Basic Catalog) and renders the result with `<A2uiSurface>` from
 * `@a2ui/react`. Every visible widget is an SDK implementation; nothing here re-implements one.
 * Stories hide this harness from Controls and the components manifest on purpose.
 */
export function BasicSurface({ message, onAction, watch = [] }: BasicSurfaceProps) {
  const serialized = JSON.stringify(message);
  const stableMessage = useMemo(() => JSON.parse(serialized) as CreateSurfaceMessage, [serialized]);
  const watchKey = watch.join('\n');
  const [surface, setSurface] = useState<SurfaceModel<ReactCatalogComponent> | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, unknown>>({});

  // Keep the latest callback without recreating the SDK processor (and losing user input) on every render.
  const actionRef = useRef(onAction);
  actionRef.current = onAction;

  useEffect(() => {
    const processor = new MessageProcessor<ReactCatalogComponent>(
      [basicCatalog],
      (action) => actionRef.current?.(action),
      { validationConfig: STRICT_VALIDATION },
    );
    const issues = processor.processMessagesWithErrors([stableMessage]);
    const created = [...processor.getSurfaces().values()][0] ?? null;
    setErrors(issues.map(({ error }) => error.message));
    setSurface(created);

    const paths = watchKey ? watchKey.split('\n') : [];
    const read = () => Object.fromEntries(paths.map((path) => [path, created?.dataModel.get(path)]));
    setValues(read());
    const subscriptions = created ? paths.map((path) => created.dataModel.subscribe(path, () => setValues(read()))) : [];

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
      processor.dispose();
    };
  }, [stableMessage, watchKey]);

  return (
    <MarkdownContext.Provider value={renderMarkdown}>
      {errors.length > 0 ? (
        <pre className="sdk-error" role="alert">
          SDK validation rejected this surface:{'\n'}
          {errors.join('\n')}
        </pre>
      ) : surface ? (
        <div className="a2ui-stage" data-surface-id={surface.id}>
          <A2uiSurface surface={surface} />
        </div>
      ) : (
        <p className="muted">Preparing preview…</p>
      )}
      {watch.length > 0 && surface && <DataModelPanel values={values} />}
    </MarkdownContext.Provider>
  );
}

function DataModelPanel({ values }: { values: Record<string, unknown> }) {
  return (
    <aside className="data-model" aria-label="Live SDK data model" aria-live="polite">
      <span className="data-model__title">SDK data model · live</span>
      <dl>
        {Object.entries(values).map(([path, value]) => (
          <div key={path} className="data-model__row">
            <dt>
              <code>{path}</code>
            </dt>
            <dd>
              <code data-testid={`data-model:${path}`}>{value === undefined ? 'undefined' : JSON.stringify(value)}</code>
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
