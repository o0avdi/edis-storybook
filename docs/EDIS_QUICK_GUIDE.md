# EDIS quick guide (presenter cheat sheet)

Before visitors arrive: Storybook running at http://localhost:6006 (`npm run storybook`) and a second terminal open in
the project folder. Setup steps are in the README under **Running the EDIS Demo on macOS**.

## A. What to say about Storybook (20–30 s)

> "An AI agent shouldn't have to write a new screen for every request. With the open-source A2UI protocol, the agent picks
> from a catalog of approved building blocks, like text, cards, buttons and sliders, and sends a JSON message
> describing how to arrange them. The app then renders that message. What you're looking at is Storybook, a tool for
> previewing and documenting UI components. We use it to show the official A2UI Basic Catalog, each component live,
> and a full budget tracker built only from those blocks."

## B. What to demonstrate (click by click)

1. **Start Here → Official Basic Catalog.** Type `slider` in the filter, click **Slider**, open **Official JSON**.
   *"This is the official definition the agent must follow. It comes with the A2UI SDK; we didn't write it."*
2. **Basic Catalog → Interactive → Button.** Click the button, then open the **Actions** tab under the preview.
   *"A click becomes an event the agent receives: its name, where it came from, and any data."*
3. **Basic Catalog → Interactive → Slider.** Drag the slider and point at the **data model** panel underneath.
   *"The slider is bound to a value, and that value updates as I drag it."*
4. **Composed Example → November Budget.** Click **Dining out**, then **Show emergency fund → Edit amounts →
   Check coverage**.
   *"There is no budget component. This whole screen is the same building blocks. The responses here are scripted
   sample logic, not a live AI call, so the demo is reliable."*
5. Click **Show createSurface JSON**.
   *"This is the single A2UI message that describes the entire screen."*

## C. What to say about the exporter (30–45 s)

> "Storybook already holds documentation and metadata for a team's own components: their properties, types,
> defaults and descriptions. Our exporter is a command-line tool that reads that metadata from a *built* Storybook
> (its components manifest). It converts each supported property into an A2UI catalog definition, checks the result
> against the official A2UI schemas, and writes two files: `catalog.json`, the definition, and `export-report.json`,
> which records what was exported or blocked and why. It doesn't guess. Things like event handlers or child content
> block the component instead of being silently dropped. After a developer connects a matching renderer
> implementation, that catalog could be given to an agent so it can use the team's own components."

Keep it accurate: the exporter produces a **catalog definition**, not a working component. It did **not** generate the
Basic Catalog.

## D. Live command and the frozen examples

In the second terminal:

```bash
npm run export:demo
```

It prints the real `npx storybook-a2ui export ...` command, runs it on `ProgressIndicator`, and ends with
**EXPORT SUCCEEDED** and the output folder (`demo-output/run-001/`, then `run-002/`, ...). Each run gets a new folder.

Then open the two frozen examples in VS Code (these are the only exported JSON files we present):

- `demo-examples/01-single-component/catalog.json`: `ProgressIndicator` only
- `demo-examples/02-full-exported-catalog/catalog.json`: `StatusBadge`, `MetricLabel`, `ProgressIndicator`

If the live command fails, skip it and open the frozen files. They don't depend on the exporter running.

## E. Likely visitor questions

**Did you write these Basic Catalog components?**
No. They're the official A2UI SDK components. We built the Storybook previews and documentation, the budget example
that composes them, and the separate exporter.

**Does the agent write React code?**
No. The agent sends JSON that names catalog components and their properties. The app's A2UI renderer turns that JSON
into the interface. The agent can only use components the catalog defines.

**Is the budget tracker a dedicated component?**
No. It's one `createSurface` message made of Text, Row, Column, Card, Button and TextField. In Storybook the replies
are scripted sample logic. Live AI prompting is part of our separate demo app.

**Does the exporter work with any Storybook library?**
Not any. It reads React and Angular Storybook builds and converts simple properties: text, numbers, true/false values
and fixed option lists. Components with events, child content, objects or arrays are blocked and explained in the
report rather than guessed. It's a prototype.

**Can the exported components already be rendered by your application?**
Not yet. The exporter produces the catalog definition. A developer still has to register a renderer implementation
for each component, and we haven't done that for these three. There is also one known schema issue we documented: the
generated schemas reject the message-level `id` field (`docs/EXPORTER_FINDINGS.md`).
