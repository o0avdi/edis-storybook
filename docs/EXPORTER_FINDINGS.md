# Exporter findings

Findings about the pinned exporter (`storybook-a2ui` at commit `142dd7b4523ff3b37fabacd798b09fbc9de2dfdb`)
discovered while building this demo. Per the project brief, the exporter's code, specification, validation and
default strict behavior were **not** changed, and generated output was **not** edited to hide anything. Each
finding has a read-only reproducer.

## 1. Exported components reject the envelope `id` (`additionalProperties: false`)

**Status:** reproduced on Windows 11 / Node 24.20.0, 2026-11-19. Not patched.

**What happens.** The pinned A2UI v1.0 envelope defines a wire component as

```json
"Component": {
  "allOf": [
    { "$ref": "common_types.json#/$defs/ComponentCommon" },
    { "$ref": "catalog.json#/$defs/anyComponent" },
    { "type": "object", "properties": { "component": { "not": { "const": "Surface" } } } }
  ],
  "unevaluatedProperties": false
}
```

`ComponentCommon` declares `id`. The exporter (`src/a2ui/catalog.mjs`) emits each component schema with
`additionalProperties: false`. In JSON Schema 2020-12, `additionalProperties` only considers properties declared in
its own subschema, so inside the `anyComponent` branch the envelope's `id` counts as "additional" and is rejected.
Official Basic Catalog components omit `additionalProperties` and rely on the envelope's
`unevaluatedProperties: false`, which still rejects undeclared properties.

**Reproducer** (requires `npm run catalog:all` first; changes nothing on disk):

```powershell
node scripts/repro-envelope-id.mjs
# optional: node scripts/repro-envelope-id.mjs a2ui-catalog/extension/catalog.json
```

Observed output:

```
VALID    official Basic Catalog (exporter spec/v1_0/basic_catalog.json)
         {"id":"greeting","component":"Text","text":"Hello"}
INVALID  exported catalog as written (a2ui-catalog/progress-indicator/catalog.json)
         {"id":"progress","component":"ProgressIndicator","label":"Budget used","value":74}
         #/additionalProperties must NOT have additional properties {"additionalProperty":"id"}
VALID    CONTROL: same exported catalog, additionalProperties:false removed in memory
INVALID  CONTROL: same, plus an undeclared property (must still be rejected)
         #/unevaluatedProperties must NOT have unevaluated properties {"unevaluatedProperty":"color"}
```

The two controls show that the issue comes from `additionalProperties: false`, and that removing it would not make the
schema permissive.

**What still holds.** `storybook-a2ui export` reports `validation: PASS`. Its validator checks the catalog
against the catalog meta-schema and structural rules and compiles every component schema, and
`createComponentInstanceValidator` accepts component **bodies** (`{ "component": "ProgressIndicator", ... }` without `id`).
`npm run catalog:verify` checks all of that, and it also prints a `KNOWN` line whenever this finding still reproduces.

**Impact on this demo.** None at runtime: the exported extension catalog is not registered with a renderer here (see
README). It matters for anyone who validates agent messages that use the exported catalog against the envelope schema.

**Suggested upstream direction (not applied).** Either drop `additionalProperties: false` (matching the official
Basic Catalog and relying on the envelope's `unevaluatedProperties`), or use `unevaluatedProperties: false` at the
component level together with an `allOf` reference to `ComponentCommon`. Either change belongs in the exporter
repository, together with a regression test that validates a full `createSurface` message.

## 2. Observations outside the exporter

- **SDK TextField labels are not programmatically associated** with their `<input>` (the rendered `<label>` has no
  `for`, and the input has no `aria-labelledby`), so `getByLabel` cannot find the field. The e2e tests scope by the
  host element's text instead. This belongs to `@a2ui/web_core` 0.15.0, not to this repository.
- **Ajv's `discriminator` keyword cannot compile the official Basic Catalog's `anyComponent`**, because several official
  components are `allOf`-based. The reproducer uses plain `oneOf` semantics, which give the same answer for these
  inputs. This is unrelated to finding 1.
