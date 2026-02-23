#!/usr/bin/env node
/**
 * affected — Analizador de impacto de dependencias para proyectos React/Vite
 *
 * Dado un archivo fuente, muestra todos los archivos que lo importan
 * (directa o transitivamente) y las rutas de la app que necesitas probar.
 *
 * Uso:
 *   affected <archivo>
 *   affected src/components/Button.tsx
 *   affected hooks/useAuth.ts
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, resolve, relative, dirname, basename, extname } from 'path';
// ── ANSI colors ───────────────────────────────────────────────────────────────

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
};

const bold = (s) => `${C.bold}${s}${C.reset}`;
const dim = (s) => `${C.dim}${s}${C.reset}`;
const paint = (color, s) => `${color}${s}${C.reset}`;
const SEP = dim('─'.repeat(55));

// ── Encontrar raíz del proyecto ───────────────────────────────────────────────

function findProjectRoot(startDir) {
  let dir = resolve(startDir);
  while (true) {
    if (existsSync(join(dir, 'package.json'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return resolve(startDir); // llegó al tope del FS
    dir = parent;
  }
}

// ── Encontrar directorio fuente ───────────────────────────────────────────────

function findSrcDir(rootDir) {
  for (const name of ['src', 'app', 'source', 'lib']) {
    const full = join(rootDir, name);
    if (existsSync(full) && statSync(full).isDirectory()) return full;
  }
  return rootDir;
}

// ── Parser JSONC (JSON con comentarios) ───────────────────────────────────────
// Las regex no sirven aquí: `"@/*"` contiene `/*` y `"./src/*"` contiene `*/`,
// entonces una regex de block-comment devora todo el contenido entre ellos.
// Este parser carácter por carácter sabe si está dentro de un string o no.

function parseJsonc(text) {
  let out = '';
  let i = 0;
  let inStr = false;

  while (i < text.length) {
    if (inStr) {
      if (text[i] === '\\') {
        out += text[i++] + text[i++]; // escape: copia el par y avanza
        continue;
      }
      if (text[i] === '"') inStr = false;
      out += text[i++];
    } else {
      // Comentario de línea: // …
      if (text[i] === '/' && text[i + 1] === '/') {
        while (i < text.length && text[i] !== '\n') i++;
        continue;
      }
      // Comentario de bloque: /* … */
      if (text[i] === '/' && text[i + 1] === '*') {
        i += 2;
        while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
        i += 2;
        continue;
      }
      if (text[i] === '"') inStr = true;
      out += text[i++];
    }
  }

  // Trailing commas: ,} o ,]
  return out.replace(/,(\s*[}\]])/g, '$1');
}

// ── Leer path aliases de tsconfig/jsconfig ────────────────────────────────────

function loadAliases(rootDir) {
  const aliases = new Map(); // prefijo → ruta absoluta

  for (const filename of ['tsconfig.json', 'tsconfig.app.json', 'jsconfig.json']) {
    const cfgPath = join(rootDir, filename);
    if (!existsSync(cfgPath)) continue;
    try {
      const raw = parseJsonc(readFileSync(cfgPath, 'utf-8'));

      const cfg = JSON.parse(raw);
      const paths = cfg?.compilerOptions?.paths ?? {};
      const baseUrl = cfg?.compilerOptions?.baseUrl ?? '.';
      const base = resolve(rootDir, baseUrl);

      for (const [alias, targets] of Object.entries(paths)) {
        if (!targets.length) continue;
        const cleanAlias = alias.replace(/\/\*$/, '');
        const cleanTarget = targets[0].replace(/\/\*$/, '');
        aliases.set(cleanAlias, resolve(base, cleanTarget));
      }
    } catch {
      /* tsconfig mal formado — ignorar */
    }
  }

  return aliases;
}

// ── Escanear archivos fuente ──────────────────────────────────────────────────

const SRC_EXT = new Set(['.ts', '.tsx', '.js', '.jsx']);
const IGNORE_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.next',
  '.nuxt',
  'out',
  'coverage',
  '.turbo',
  '.cache',
  '__tests__',
]);

function getAllSrcFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.has(name)) getAllSrcFiles(full, acc);
    } else if (SRC_EXT.has(extname(name))) {
      acc.push(full);
    }
  }
  return acc;
}

// ── Resolución de imports ─────────────────────────────────────────────────────

function tryResolve(base) {
  // Primero intentar con extensiones y index antes que el directorio base,
  // porque existsSync(dir) devuelve true para directorios también.
  const candidates = [
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
    `${base}/index.js`,
    `${base}/index.jsx`,
    base,
  ];
  for (const c of candidates) {
    try {
      if (statSync(c).isFile()) return c;
    } catch {
      /* no existe */
    }
  }
  return null;
}

function resolveImport(importPath, fromFile, aliases) {
  // Importaciones relativas
  if (importPath.startsWith('.')) {
    return tryResolve(resolve(dirname(fromFile), importPath));
  }
  // Aliases (e.g. @/components/Button, ~/utils)
  for (const [prefix, target] of aliases) {
    if (importPath === prefix || importPath.startsWith(prefix + '/')) {
      const rest = importPath.slice(prefix.length);
      return tryResolve(target + rest);
    }
  }
  return null; // node_modules u otro — ignorar
}

// ── Extraer imports de un archivo ─────────────────────────────────────────────

function extractImports(filePath) {
  try {
    const src = readFileSync(filePath, 'utf-8');
    const results = [];
    // import/export estáticos + dynamic import()
    const re =
      /(?:(?:import|export)\s+(?:type\s+)?[^'"]*?from\s+['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
    let m;
    while ((m = re.exec(src)) !== null) results.push(m[1] ?? m[2]);
    return results;
  } catch {
    return [];
  }
}

// ── Auto-detectar rutas del router ────────────────────────────────────────────

function detectRoutes(allFiles) {
  const routes = new Map(); // basename(file) → route path

  const addRoute = (path, componentName) => {
    // Busca el archivo que corresponde al nombre del componente
    const match = allFiles.find((f) => {
      const name = basename(f, extname(f));
      return name === componentName || name.toLowerCase() === componentName.toLowerCase();
    });
    if (match && !routes.has(basename(match))) {
      routes.set(basename(match), path);
    }
  };

  for (const file of allFiles) {
    try {
      const src = readFileSync(file, 'utf-8');

      // JSX: <Route path="..." element={<Component />} />  (atributos en cualquier orden)
      const routeTagRe = /<Route\b([^>]*?)\/>/gs;
      let tagMatch;
      while ((tagMatch = routeTagRe.exec(src)) !== null) {
        const attrs = tagMatch[1];
        const pathM = /path\s*=\s*["']([^"']+)["']/.exec(attrs);
        const elemM = /element\s*=\s*\{[^<]*<(\w+)/.exec(attrs);
        if (pathM && elemM) addRoute(pathM[1], elemM[1]);
      }

      // JSX: <Route path="..." element={<Component ... (multi-línea)
      const multiRe =
        /<Route\b[^>]*?path\s*=\s*["']([^"']+)["'][^>]*?element\s*=\s*\{[^<]*<(\w+)/gs;
      let mr;
      while ((mr = multiRe.exec(src)) !== null) addRoute(mr[1], mr[2]);

      const multiRe2 =
        /<Route\b[^>]*?element\s*=\s*\{[^<]*<(\w+)[^>]*?path\s*=\s*["']([^"']+)["']/gs;
      while ((mr = multiRe2.exec(src)) !== null) addRoute(mr[2], mr[1]);

      // Object style: { path: '...', element: <Component }  (React Router v7 / TanStack)
      const objRe = /\{\s*path\s*:\s*["']([^"']+)["'][^}]*?element\s*:\s*<(\w+)/gs;
      while ((mr = objRe.exec(src)) !== null) addRoute(mr[1], mr[2]);

      const objRe2 = /\{\s*element\s*:\s*<(\w+)[^}]*?path\s*:\s*["']([^"']+)["']/gs;
      while ((mr = objRe2.exec(src)) !== null) addRoute(mr[2], mr[1]);
    } catch {
      /* ignorar archivos no legibles */
    }
  }

  return routes;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

const arg = process.argv[2];

if (!arg || arg === '--help' || arg === '-h') {
  console.log(`
${bold('affected')} — Analizador de impacto de dependencias

${bold('Uso:')}
  affected ${dim('<archivo>')}

${bold('Ejemplos:')}
  affected src/components/Button.tsx
  affected src/hooks/useAuth.ts
  affected components/Layout.jsx
`);
  process.exit(arg ? 0 : 1);
}

// Detectar entorno del proyecto
const cwd = process.cwd();
const rootDir = findProjectRoot(cwd);
const srcDir = findSrcDir(rootDir);
const aliases = loadAliases(rootDir);

// Resolver el archivo objetivo
let target = null;
for (const candidate of [
  resolve(arg),
  resolve(cwd, arg),
  resolve(rootDir, arg),
  resolve(srcDir, arg),
]) {
  if (existsSync(candidate)) {
    target = candidate;
    break;
  }
}

if (!target) {
  console.error(`\n${paint(C.red, 'Error:')} archivo no encontrado: ${arg}`);
  console.error(dim(`  Directorio del proyecto: ${rootDir}`));
  console.error(dim(`  Directorio fuente:       ${srcDir}\n`));
  process.exit(1);
}

// Construir grafo de dependencias inverso
const allFiles = getAllSrcFiles(srcDir);

// Normalizar target al casing real del filesystem.
// En macOS (case-insensitive) existsSync('linkAuthor.tsx') devuelve true
// aunque el archivo sea 'LinkAuthor.tsx', pero el Map usa igualdad estricta.
const canonical = allFiles.find((f) => f.toLowerCase() === target.toLowerCase());
if (canonical) target = canonical;

const reverseGraph = new Map(allFiles.map((f) => [f, new Set()]));

for (const file of allFiles) {
  for (const imp of extractImports(file)) {
    const resolved = resolveImport(imp, file, aliases);
    if (resolved && reverseGraph.has(resolved)) {
      reverseGraph.get(resolved).add(file);
    }
  }
}

// BFS para encontrar todos los archivos afectados
const levels = new Map(); // file → profundidad (0 = target)
const queue = [[target, 0]];

while (queue.length > 0) {
  const [current, depth] = queue.shift();
  if (levels.has(current)) continue;
  levels.set(current, depth);
  for (const importer of reverseGraph.get(current) ?? []) {
    if (!levels.has(importer)) queue.push([importer, depth + 1]);
  }
}

// Agrupar resultados
const affected = [...levels.entries()].filter(([f]) => f !== target).sort((a, b) => a[1] - b[1]);

// Auto-detectar rutas (basado en contenido, no en carpetas)
const detectedRoutes = detectRoutes(allFiles);

// Archivos a probar: los que tienen ruta detectada en el router.
// Si no hay rutas detectadas, caemos a archivos sin importadores en
// todo el proyecto (raíces reales), excluyendo bootstrap (main/index).

// Agrupar dinámicamente por primera carpeta real (sin asumir nada)
// Archivos en la raíz de srcDir quedan en el grupo ''.
const folderGroups = new Map(); // carpeta → entries[]
for (const [file, depth] of affected) {
  const rel = relative(srcDir, file);
  const slash = rel.indexOf('/');
  const folder = slash === -1 ? '' : rel.slice(0, slash);
  if (!folderGroups.has(folder)) folderGroups.set(folder, []);
  folderGroups.get(folder).push({ file, rel, depth });
}

// Ordenar: primero las carpetas con rutas detectadas, luego alfabético
const sortedFolders = [...folderGroups.entries()].sort(([a, aItems], [b, bItems]) => {
  const aHasRoute = aItems.some(({ file }) => detectedRoutes.has(basename(file)));
  const bHasRoute = bItems.some(({ file }) => detectedRoutes.has(basename(file)));
  if (aHasRoute !== bHasRoute) return aHasRoute ? -1 : 1;
  return a.localeCompare(b);
});

// ── Imprimir resultados ───────────────────────────────────────────────────────

const targetRel = relative(rootDir, target);
console.log();
console.log(`${bold('Análisis de impacto')}  ${dim(targetRel)}`);
console.log(SEP);

if (affected.length === 0) {
  console.log(`\n${dim('Ningún archivo importa este módulo.')}\n`);
  process.exit(0);
}

console.log(
  `${bold(String(affected.length))} archivo(s) usan este módulo ${dim('(directa o transitivamente)')}\n`,
);

const depthLabel = (d) => (d === 1 ? dim('directo') : dim(`↑${d}`));

// Paleta de colores cíclica para carpetas (sin asumir semántica)
const PALETTE = [C.cyan, C.blue, C.green, C.magenta, C.yellow];
let colorIdx = 0;
const folderColor = new Map();
const getColor = (folder) => {
  if (!folderColor.has(folder)) folderColor.set(folder, PALETTE[colorIdx++ % PALETTE.length]);
  return folderColor.get(folder);
};

for (const [folder, items] of sortedFolders) {
  const label = folder === '' ? dim('(raíz del src)') : bold(folder + '/');
  const color = getColor(folder);
  console.log(paint(color, label));

  for (const { file, rel, depth } of items) {
    const route = detectedRoutes.get(basename(file));
    const mark = route ? paint(C.yellow, ' ★') : '  ';
    const routeStr = route ? paint(C.yellow, `  → ${route}`) : '';
    console.log(`  ${paint(color, '•')} ${rel}  ${depthLabel(depth)}${mark}${routeStr}`);
  }
  console.log();
}

// ── Resumen de rutas a probar ─────────────────────────────────────────────────

const ROOT_FILES = new Set([
  'main.tsx',
  'main.ts',
  'main.jsx',
  'main.js',
  'index.tsx',
  'index.ts',
  'index.jsx',
  'index.js',
]);

// Caso 1: hay rutas detectadas → mostrar las páginas afectadas con ruta
const routedTargets = affected
  .filter(([file]) => detectedRoutes.has(basename(file)))
  .map(([file]) => ({ rel: relative(srcDir, file), route: detectedRoutes.get(basename(file)) }));

// Caso 2: sin rutas detectadas → mostrar archivos sin importadores en el proyecto
//         (raíces reales del grafo), excluyendo bootstrap
const projectRoots = affected
  .filter(([file]) => !ROOT_FILES.has(basename(file)) && (reverseGraph.get(file)?.size ?? 0) === 0)
  .map(([file]) => ({ rel: relative(srcDir, file) }));

const toTest = routedTargets.length > 0 ? routedTargets : projectRoots;

if (toTest.length > 0) {
  console.log(SEP);
  console.log(bold('Rutas a probar manualmente:') + '  ' + dim('(★)'));
  console.log();
  for (const { rel, route } of toTest) {
    const routeStr = route ? `${bold(route)}  ${dim(rel)}` : dim(rel);
    console.log(`  ${paint(C.yellow, '→')} ${routeStr}`);
  }
  console.log();
}
