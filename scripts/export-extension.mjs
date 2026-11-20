import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const command = process.argv[2] === 'inspect' ? 'inspect' : 'export';
const build = resolve('storybook-static');
const cli = resolve('node_modules/storybook-a2ui/bin/storybook-a2ui.mjs');
const manifest = resolve(build, 'manifests/components.json');
if (!existsSync(cli) || !existsSync(manifest)) {
  console.error('Run npm install and npm run build-storybook first; components manifest missing.');
  process.exitCode = 2;
} else {
  const args = [cli, command, '--storybook', build];
  if (command === 'export') {
    const target = resolve('a2ui-catalog/extension');
    rmSync(target, { recursive: true, force: true });
    mkdirSync(target, { recursive: true });
    args.push('--components', 'StatusBadge');
    args.push('--catalog-id', 'https://o0avdi.github.io/a2ui-basic-storybook/catalogs/extension/v1');
    args.push('--out', target);
    args.push('--title', 'Storybook Primitive Extension');
  }
  console.log(`Exporter mode: ${command}. SDK primitive gallery is NOT part of this conversion.`);
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
  process.exitCode = result.status ?? 2;
}
