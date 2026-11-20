# A2UI Basic Catalog in Storybook

**Purpose:** demonstrate how a small set of **official A2UI primitives** can be composed by an agent into a complex application, using the exact November budget example from the capstone showcase as a concrete result.

This project deliberately **does not create** `BudgetDashboard`, `StatCard`, `BudgetRow`, etc. as application-specific reusable UI components. The budget dashboard is an **A2UI `createSurface` message** that composes `Text`, `Row`, `Column`, `Card`, `Button`, and `TextField`, rendered by the official A2UI React/web SDK.

Source references:
- Original budget composition: https://github.com/o0avdi/a2ui-showcase-demo/blob/feature/personal-budget-demo/server/providers/budget-sample.ts
- Official A2UI Basic Catalog: https://a2ui.org/concepts/catalogs/
- Capstone Storybook exporter: https://github.com/o0avdi/a2ui-storybook-exporter

## Quick start

Requires Node.js 24 recommended (minimum 22.12), npm, Git, and internet for the initial installation.

```sh
npm install
npm run storybook
```

Open http://localhost:6006.

Explore in this order:

1. **Start Here / Official catalog schema**: browse the SDK's *18 official Basic Catalog component schemas* and its 14 functions. These come from `basicCatalog.toJson()`.
2. **Basic Catalog / Primitives**: individual `Text`, `Card`, `Row`, `Column`, `Button`, `TextField`, `CheckBox`, `ChoicePicker`, `Slider`, `Tabs`, etc. are **actually rendered** from small `createSurface` messages using official SDK implementations. The Storybook story code is a *harness*, not a replacement implementation of these primitives.
3. **Agent Composition / November budget**: the same six basic components compose a more advanced screen. The example is based on the original sample's deterministic JSON builder, including editing and selecting categories. It is **not a live AI call**. The JSON button shows the message the A2UI renderer receives.
4. **Exporter Extension / StatusBadge**: a deliberately small **new** primitive. Unlike the built-in SDK components, `StatusBadge` is a real React source component with Storybook docgen metadata, and our exporter can convert it to its **own** custom A2UI catalog definition.

## Two kinds of catalog output (important for demo honesty)

In another terminal:

```sh
npm run demo:export
```

The command creates:

| File | Where the JSON actually came from |
| --- | --- |
| `a2ui-catalog/basic/catalog.json` | **Official** catalog serialized from `@a2ui/web_core` (`basicCatalog.toJson()`), *not* created by our exporter. |
| `storybook-static/manifests/components.json` | Storybook's source-component metadata, enabled by `features.componentsManifest: true`. |
| `a2ui-catalog/extension/catalog.json` | **Our exporter**, applied to the new primitive `StatusBadge` via its actual React/Storybook metadata. |
| `a2ui-catalog/extension/export-report.json` | Our exporter's validation and compatibility report for `StatusBadge`. |

The verification script requires at least the expected SDK Basic Catalog components, an exported `StatusBadge` schema, and a passing A2UI v1.0 validation status for the extension.

Use the individual commands when troubleshooting:

```sh
npm run build-storybook
npm run catalog:basic
npm run inspect:storybook
npm run catalog:export
npm run catalog:verify
```

### Why not run the exporter on the default Basic Catalog?

The **official Basic Catalog already exists as a rich schema** describing component children, actions, bindings, validators, arrays, functions, and more. The SDK's Basic components are web-rendered implementations, not ordinary local React source components with flat Storybook-documented props. Storybook can **display** them through an SDK preview harness, but that does not mean Storybook's docgen has their authoritative source contracts.

Our current exporter (`storybook-a2ui`, prototype v0.1) is specifically a **Storybook-manifest → A2UI component-contract converter**. It does not parse SDK A2UI schemas, and it intentionally blocks unsupported composition and action prop types. Attempting to re-export the Basic Catalog from Storybook props would lose important protocol semantics. Doing so would be misleading and unnecessary.

**Correct demonstration story:**

```
Official A2UI Basic Catalog (already provided by SDK)
           +
Agent chooses and arranges primitives in A2UI JSON
           ↓
Official A2UI renderer → budget tracker

For new / company-specific components:
React primitive → Storybook documentation + manifest
           ↓
Our exporter → validated additional A2UI catalog definition
           ↓
Register renderer implementation before agents can use it
```

Note that the exported `StatusBadge` **does not automatically render inside the showcase**: a custom A2UI component implementation must be registered alongside the Basic Catalog, under the matching custom `catalogId`. This Storybook project intentionally stops after exporting and validating its schema. It makes no claim of a completed SDK registration.

## Specific project files

- `src/basic/BasicCatalogExplorer.tsx`: official schema viewer for all 18 Basic components
- `src/basic/BasicSurface.tsx`: standard SDK `MessageProcessor` and `<A2uiSurface>` adapter, not a new component library
- `src/basic/examples.ts`: small A2UI message examples for individual built-ins
- `src/examples/budget.ts`: deterministic composition adapted from the showcase's budget sample
- `src/examples/BudgetSurface.tsx`: renders the composed budget JSON and relays actions back to the sample logic
- `src/extensions/StatusBadge.tsx`: only new exported React primitive in this project
- `.storybook/main.ts`: manifest feature flag + React docgen
- `scripts/sync-basic.mjs`: serializes the *installed* SDK's authoritative Basic Catalog
- `scripts/export-extension.mjs`: invokes the unchanged, pinned capstone exporter

## Publishing to GitHub

Create an empty repository named `a2ui-basic-storybook`. In the extracted folder:

```sh
git init -b main
npm install
git add .
git commit -m "Demo A2UI Basic Catalog and Storybook export extension"
git remote add origin https://github.com/o0avdi/a2ui-basic-storybook.git
git push -u origin main
```

Commit the resulting `package-lock.json` for reproducibility. GitHub Actions currently uses `npm install` so the initial ZIP can run without a committed lock; after committing a lockfile, change CI to `npm ci`.

## Limitations and testing

- Live installation/build was **not executed** in the packaging environment, which had no access to the npm registry. Run `npm run typecheck` and `npm run demo:export` locally, and fix any dependency/SDK incompatibilities before relying on a showcase demo.
- The budget screen is adapted from a sample, not generated live by an LLM in Storybook. The separate showcase app is where live agent prompting happens.
- 14 basic primitives have example stories. The schema explorer lists all 18 official components; the remaining primitives can get full preview stories later.
- The CSS is a lightweight presentation layer for the SDK's existing widgets; it does not rebuild or redefine the Basic Catalog.
