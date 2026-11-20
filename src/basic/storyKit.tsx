/**
 * Shared Storybook plumbing for the official Basic Catalog preview stories.
 *
 * Story args are PREVIEW CONTROLS: each story's `build(args)` turns them into a real A2UI
 * `createSurface` message, which the SDK renders. The args are not the SDK component's props
 * and are deliberately kept out of the components manifest (`!manifest` tag), so the exporter
 * never mistakes these previews for exportable source components.
 */
import type { ReactNode } from 'react';
import type { ArgTypes } from '@storybook/react-vite';
import type { ActionPayload } from '@a2ui/web_core/v1_0';
import { BasicSurface } from './BasicSurface';
import type { CreateSurfaceMessage } from './messages';
import { officialEnum, officialProperty } from './schema';
import { SdkDocsPage } from './SdkDocsPage';

type InputType = ArgTypes[string];

export const A2UI_CATEGORY = 'A2UI properties';
export const SETUP_CATEGORY = 'Preview setup';

/**
 * Storybook `fn()` spy for SDK actions. Called as `(eventName, payload)` so the Actions panel shows the
 * event name at a glance (`onAction: ["save_budget", {...}]`) with the full SDK payload one click away.
 */
export type ActionSpy = (eventName: string, payload: ActionPayload) => void;
export type WithAction = { onAction?: ActionSpy };

/** Framed preview area used by every story so components never float in a corner. */
export function Stage({
  caption,
  tone = 'sdk',
  width = 'standard',
  children,
}: {
  caption?: ReactNode;
  tone?: 'sdk' | 'source';
  width?: 'narrow' | 'standard' | 'wide';
  children: ReactNode;
}) {
  return (
    <div className={`stage-frame stage-frame--${width}`}>
      <section className={`stage stage--${tone}`}>
        <header className="stage__caption">
          {caption ??
            (tone === 'sdk' ? (
              <>
                <span className="dot dot--sdk" aria-hidden /> Rendered by the official A2UI SDK · Basic Catalog v1
              </>
            ) : (
              <>
                <span className="dot dot--source" aria-hidden /> React source component in this repo · exportable
              </>
            ))}
        </header>
        <div className="stage__body">{children}</div>
      </section>
    </div>
  );
}

/** Renders a preview message through the internal SDK harness inside a Stage. */
export function SdkPreview({
  message,
  onAction,
  watch,
  width,
}: {
  message: CreateSurfaceMessage;
  onAction?: ActionSpy;
  watch?: readonly string[];
  width?: 'narrow' | 'standard' | 'wide';
}) {
  return (
    <Stage width={width}>
      <BasicSurface message={message} onAction={onAction && ((action) => onAction(action.name, action))} watch={watch} />
    </Stage>
  );
}

/**
 * A control that maps 1:1 to an official A2UI property. Description, enum options and default
 * are read from the SDK's serialized Basic Catalog, so controls cannot drift from the real schema.
 */
export function a2uiArg(component: string, property: string, control?: InputType['control']): InputType {
  const row = officialProperty(component, property);
  if (!row) throw new Error(`${component}.${property} is not in the official Basic Catalog`);
  const options = officialEnum(component, property);
  return {
    name: property,
    description: row.description,
    control: control ?? (options.length ? { type: options.length > 4 ? 'select' : 'inline-radio' } : undefined),
    ...(options.length ? { options } : {}),
    table: {
      category: A2UI_CATEGORY,
      type: { summary: row.type },
      ...(row.defaultValue !== undefined ? { defaultValue: { summary: JSON.stringify(row.defaultValue) } } : {}),
    },
  };
}

/** A control that only shapes the preview (initial data model values, child Text content, item counts). */
export function setupArg(description: string, control?: InputType['control'], extra: Partial<InputType> = {}): InputType {
  return { description, control, ...extra, table: { category: SETUP_CATEGORY, ...extra.table } };
}

/** Event spy argument: logged in the Actions panel, hidden from Controls and the docs table. */
export const actionArg: InputType = { table: { disable: true }, control: false };

/**
 * Parameters shared by all Basic Catalog preview stories: the custom docs page, the official
 * component name, and a Source block that shows the exact A2UI message for the current args.
 */
export function sdkParameters<A>(component: string, build: (args: A) => CreateSurfaceMessage, summary: string) {
  return {
    a2ui: { component },
    controls: { sort: 'none' as const },
    docs: {
      page: SdkDocsPage,
      description: { component: summary },
      source: {
        language: 'json',
        transform: (_code: string, context: { args: unknown }) => JSON.stringify(build(context.args as A), null, 2),
      },
    },
  };
}
