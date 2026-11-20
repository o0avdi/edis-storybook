import { Controls, Description, Heading, Primary, Source, Stories, Subtitle, Title, Unstyled, useOf } from '@storybook/addon-docs/blocks';
import { OFFICIAL_CATALOG } from './schema';
import { SchemaTable } from './SchemaTable';
import { explorerHref } from './storyLinks';

/**
 * Docs page for an official Basic Catalog component. It separates three things a viewer could
 * otherwise confuse: the live SDK render, the preview controls that build the message, and the
 * official schema the agent actually sees.
 */
export function SdkDocsPage() {
  const resolved = useOf('meta');
  const component = (resolved.type === 'meta' ? resolved.preparedMeta.parameters?.a2ui?.component : undefined) as
    | string
    | undefined;
  const schema = component ? OFFICIAL_CATALOG.components[component] : undefined;
  return (
    <>
      <Title />
      <Subtitle>Official A2UI Basic Catalog component · rendered by @a2ui/react + @a2ui/web_core</Subtitle>
      <Description />
      <div className="docs-callout">
        <strong>What you are looking at.</strong> The preview is the SDK&rsquo;s own <code>{component}</code> implementation,
        rendered from a <code>createSurface</code> message. The controls below build that message; they are a preview
        convenience, not this component&rsquo;s source props. The authoritative contract is the official schema further down.
      </div>
      <Primary />
      <Heading>Preview controls</Heading>
      <p className="docs-note">
        Rows under <em>A2UI properties</em> map one-to-one to official schema properties. Rows under{' '}
        <em>Preview setup</em> only shape this demo (for example the child <code>Text</code> of a Button, or the initial
        data-model value behind a binding).
      </p>
      <Controls />
      <Heading>A2UI message for the current controls</Heading>
      <Source />
      {schema && (
        <>
          <Heading>Official schema · {component}</Heading>
          <p className="docs-note">
            From <code>basicCatalog.toJson()</code> in the installed <code>@a2ui/web_core</code> (SDK-authored, not produced
            by our exporter).{' '}
            <a href={explorerHref(component)} target="_top">
              Open in the catalog explorer →
            </a>
          </p>
          <Unstyled>
            <SchemaTable schema={schema} />
          </Unstyled>
        </>
      )}
      <Stories title="Named variants" includePrimary={false} />
    </>
  );
}
