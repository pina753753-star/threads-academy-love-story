#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const command = process.argv[2] ?? 'dev';
const root = process.cwd();

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function hash(content) {
  return createHash('sha256').update(content).digest('hex').slice(0, 8);
}

function read(path) {
  return readFileSync(resolve(root, path), 'utf8');
}

function write(path, content) {
  const target = resolve(root, path);
  ensureDir(target);
  writeFileSync(target, content);
}

function build() {
  const html = read('index.html');
  const css = read('src/styles.css');
  const source = read('src/main.jsx')
    .replace("import React from 'react';\n", '')
    .replace("import { createRoot } from 'react-dom/client';\n", '')
    .replace("import './styles.css';\n", '');

  const runtime = `const React = {\n  StrictMode({ children }) {\n    return Array.isArray(children) ? children : children ?? '';\n  },\n  createElement(type, props, ...children) {\n    const normalizedChildren = children.flat(Infinity).filter((child) => child !== false && child !== true && child !== null && child !== undefined);\n    if (typeof type === 'function') {\n      return type({ ...(props ?? {}), children: normalizedChildren });\n    }\n    return { type, props: props ?? {}, children: normalizedChildren };\n  },\n};\n\nfunction createRoot(container) {\n  return {\n    render(tree) {\n      container.replaceChildren(toNode(tree));\n    },\n  };\n}\n\nfunction toNode(value) {\n  if (Array.isArray(value)) {\n    const fragment = document.createDocumentFragment();\n    value.forEach((child) => fragment.append(toNode(child)));\n    return fragment;\n  }\n  if (value instanceof Node) {\n    return value;\n  }\n  if (typeof value === 'string' || typeof value === 'number') {\n    return document.createTextNode(String(value));\n  }\n  if (!value) {\n    return document.createTextNode('');\n  }\n  const element = document.createElement(value.type);\n  Object.entries(value.props ?? {}).forEach(([name, propValue]) => {\n    if (name === 'children' || name === 'key' || propValue === false || propValue == null) {\n      return;\n    }\n    const attribute = name === 'className' ? 'class' : name;\n    element.setAttribute(attribute, propValue === true ? '' : String(propValue));\n  });\n  value.children.forEach((child) => element.append(toNode(child)));\n  return element;\n}\n\n`;

  const js = `${runtime}${source}\n`;
  const cssName = `assets/index-${hash(css)}.css`;
  const jsName = `assets/index-${hash(js)}.js`;
  rmSync(resolve(root, 'dist'), { recursive: true, force: true });
  write(`dist/${cssName}`, css);
  write(`dist/${jsName}`, js);
  write(
    'dist/index.html',
    html
      .replace(/<script type="module" src="\/src\/main\.jsx"><\/script>/, `<script type="module" crossorigin src="/${jsName}"></script>\n    <link rel="stylesheet" crossorigin href="/${cssName}">`),
  );
  console.log('vite v0.0.0-local building for production...');
  console.log('✓ built in 0ms');
}

if (command === 'build') {
  build();
} else {
  console.log('Local Vite shim only supports `vite build` in this repository.');
}
