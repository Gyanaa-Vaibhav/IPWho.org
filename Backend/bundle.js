// bundle.js
import fs from 'fs';
import path from 'path';

const pkgPath = path.resolve('./package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const dependencies = pkg.dependencies || {};

import { builtinModules } from 'module';
import { build } from 'esbuild';

const externalDeps = [
    ...Object.keys(dependencies || {}),
    ...builtinModules,
];

build({
    entryPoints: ['dist/app.js'],
    bundle: true,
    platform: 'node',
    format: 'esm', // <-- required for import.meta and top-level await
    target: 'node18', // or node20
    outfile: './bundle/app.mjs', // use .mjs extension for ESM
    minify: true,
    external: externalDeps,
}).catch(() => process.exit(1));
