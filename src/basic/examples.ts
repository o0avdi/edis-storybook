import { createSurface, textNode, type ComponentNode } from './messages';

const text = (id: string, s: string): ComponentNode => textNode(id, s);
const base = (nodes: ComponentNode[], dataModel?: Record<string, unknown>) => createSurface(nodes, dataModel);

/** Each example actually renders official Basic Catalog components via A2UI JSON. */
export const EXAMPLES = {
  Text: base([text('root', '## Text component\n\nA2UI text supports **Markdown**.')]),
  Card: base([
    { id: 'root', component: 'Card', child: 'card_content' },
    text('card_content', '**Card**\n\nContainers can hold text or another layout component.'),
  ]),
  Row: base([
    { id: 'root', component: 'Row', children: ['left', 'middle', 'right'], justify: 'spaceBetween' },
    text('left', 'Left'), text('middle', 'Center'), text('right', 'Right'),
  ]),
  Column: base([
    { id: 'root', component: 'Column', children: ['title', 'line1', 'line2'] },
    text('title', '## Column'), text('line1', 'First item'), text('line2', 'Second item'),
  ]),
  Button: base([
    { id: 'root', component: 'Button', child: 'label', variant: 'primary', action: { event: { name: 'example_click', context: {} } } },
    text('label', 'Click me'),
  ]),
  Divider: base([
    { id: 'root', component: 'Column', children: ['above', 'divider', 'below'] },
    text('above', 'Above'), { id: 'divider', component: 'Divider', axis: 'horizontal' }, text('below', 'Below'),
  ]),
  TextField: base([
    { id: 'root', component: 'TextField', label: 'Repair estimate', variant: 'number', value: { '@path': '/estimate' } },
  ], { estimate: 1200 }),
  CheckBox: base([
    { id: 'root', component: 'CheckBox', label: 'Include taxes', value: { '@path': '/taxes' } },
  ], { taxes: true }),
  ChoicePicker: base([
    { id: 'root', component: 'ChoicePicker', label: 'Expense category', variant: 'mutuallyExclusive', displayStyle: 'chips',
      options: [{ label: 'Food', value: 'food' }, { label: 'Travel', value: 'travel' }, { label: 'Other', value: 'other' }], value: { '@path': '/categories' } },
  ], { categories: ['food'] }),
  Slider: base([
    { id: 'root', component: 'Slider', label: 'Monthly goal', value: { '@path': '/goal' }, min: 0, max: 100, steps: 10 },
  ], { goal: 40 }),
  DateTimeInput: base([
    { id: 'root', component: 'DateTimeInput', label: 'Due date', value: { '@path': '/date' }, enableDate: true },
  ], { date: '2026-11-30' }),
  Tabs: base([
    { id: 'root', component: 'Tabs', tabs: [{ title: 'Overview', child: 'one' }, { title: 'Details', child: 'two' }] },
    text('one', 'This is the overview tab.'), text('two', 'This is the details tab.'),
  ]),
  List: base([
    { id: 'root', component: 'List', children: ['one', 'two', 'three'], direction: 'vertical' },
    text('one', 'Groceries'), text('two', 'Transport'), text('three', 'Dining out'),
  ]),
  Icon: base([{ id: 'root', component: 'Icon', name: 'shoppingCart' }]),
} as const;

export type BasicExampleName = keyof typeof EXAMPLES;
