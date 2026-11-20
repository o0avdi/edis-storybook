# Two-minute EDIS walkthrough

1. **Show the components:** Open `Basic Catalog / Primitives / Text`, then `Card`, `Row`, `Button`, `TextField`. Say, "These are the SDK's actual Basic Catalog components. We aren't writing a budget-specific frontend."
2. **Show their contract:** Open `Start Here / Official catalog schema`, select `Button` or `Row`, and show the JSON. Say, "The A2UI agent sees a catalog specifying exactly what each component accepts, including child relationships, events and bindings."
3. **Show composition:** Open `Agent Composition / November budget`. Say, "This dashboard isn't a custom component. It's a createSurface JSON message that references only Basic Catalog pieces." Toggle `Show A2UI createSurface JSON`. Try the `Dining out` button and the emergency fund inputs. This story uses deterministic sample logic, not a live agent.
4. **Explain our capstone exporter:** Open `Exporter Extension / StatusBadge`. Say, "When a product team builds a *new* primitive, Storybook can document its typed props, and our exporter can generate its A2UI schema." Open `a2ui-catalog/extension/catalog.json` and `export-report.json`. Do not claim that these SDK primitives were re-exported from Storybook.
5. **Close:** "Storybook describes existing components. A2UI tells an agent which components are allowed and how to compose them. Our exporter helps bridge new source components into that A2UI vocabulary, without generating the finished UI itself."

This walkthrough uses two distinct JSON artifacts:
- Official `a2ui-catalog/basic/catalog.json`, serialized from the SDK; the faithful Basic Catalog reference.
- `a2ui-catalog/extension/catalog.json`, created by our capstone Storybook exporter for a new primitive.
