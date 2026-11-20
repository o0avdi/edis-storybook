import { useState, type ReactNode } from 'react';

const TOKEN = /("(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

/** Minimal JSON syntax highlighting as React nodes (no HTML injection, no dependency). */
function highlight(json: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of json.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(json.slice(last, index));
    const [whole, string, colon, literal, number] = match;
    if (string && colon) nodes.push(<span key={index} className="json-key">{string}</span>, colon);
    else if (string) nodes.push(<span key={index} className="json-string">{string}</span>);
    else if (literal) nodes.push(<span key={index} className="json-literal">{literal}</span>);
    else if (number) nodes.push(<span key={index} className="json-number">{number}</span>);
    else nodes.push(whole);
    last = index + whole.length;
  }
  if (last < json.length) nodes.push(json.slice(last));
  return nodes;
}

export function CopyButton({ text, label = 'Copy JSON' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
    }
    window.setTimeout(() => setState('idle'), 1600);
  };
  return (
    <button type="button" className="btn btn--small" onClick={copy} aria-live="polite">
      {state === 'copied' ? 'Copied ✓' : state === 'failed' ? 'Copy blocked by browser' : label}
    </button>
  );
}

export function JsonView({
  value,
  title,
  caption,
  maxHeight,
}: {
  value: unknown;
  title?: string;
  caption?: ReactNode;
  maxHeight?: number | string;
}) {
  const json = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return (
    <figure className="json-view">
      <figcaption className="json-view__bar">
        <span className="json-view__title">{title ?? 'JSON'}</span>
        {caption && <span className="json-view__caption">{caption}</span>}
        <CopyButton text={json} />
      </figcaption>
      <pre className="json-view__code" style={maxHeight ? { maxHeight } : undefined} tabIndex={0}>
        <code>{highlight(json)}</code>
      </pre>
    </figure>
  );
}
