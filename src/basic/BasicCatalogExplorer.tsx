import { useState } from 'react';
import { basicCatalog } from '@a2ui/web_core/catalogs/basic/v1';

const document = basicCatalog.toJson() as {
  catalogId: string;
  components: Record<string, unknown>;
  functions: Record<string, unknown>;
};

const names = Object.keys(document.components);

export function BasicCatalogExplorer() {
  const [selected, setSelected] = useState('Text');
  return (
    <section className="explorer">
      <h2>Official A2UI Basic Catalog</h2>
      <p>This schema comes directly from the installed <code>@a2ui/web_core</code> package.</p>
      <p><strong>{names.length} component definitions</strong> and <strong>{Object.keys(document.functions).length} functions</strong>.</p>
      <div className="explorer-grid">
        <div className="component-list">
          {names.map((name) => <button key={name} type="button" className={selected === name ? 'selected' : ''} onClick={() => setSelected(name)}>{name}</button>)}
        </div>
        <div>
          <h3>{selected}</h3>
          <pre className="schema">{JSON.stringify(document.components[selected], null, 2)}</pre>
        </div>
      </div>
    </section>
  );
}
