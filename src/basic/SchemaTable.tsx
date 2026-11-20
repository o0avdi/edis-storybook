import { COMMON_TYPES, propertyRows, type JsonSchema } from './schema';

const formatDefault = (value: unknown) => (value === undefined ? '—' : JSON.stringify(value));

/** Property table for one component schema: name, type, required, default, description. */
export function SchemaTable({ schema, showDiscriminator = false }: { schema: JsonSchema | undefined; showDiscriminator?: boolean }) {
  const rows = propertyRows(schema).filter((row) => showDiscriminator || row.name !== 'component');
  const referenced = [...new Set(rows.flatMap((row) => row.type.split(/[^A-Za-z]+/)).filter((name) => COMMON_TYPES[name]))];
  if (!rows.length) return <p className="muted">No properties.</p>;
  return (
    <div className="schema-table">
      <table>
        <thead>
          <tr>
            <th scope="col">Property</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <th scope="row">
                <code>{row.name}</code>
                {row.required && <span className="pill pill--required" title="Required by the schema">required</span>}
              </th>
              <td>
                <code className="type">{row.type}</code>
              </td>
              <td>
                <code>{formatDefault(row.defaultValue)}</code>
              </td>
              <td>{row.description || <span className="muted">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {referenced.length > 0 && (
        <dl className="glossary">
          {referenced.map((name) => (
            <div key={name}>
              <dt>
                <code>{name}</code>
              </dt>
              <dd>{COMMON_TYPES[name]}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
