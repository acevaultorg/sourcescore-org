#!/usr/bin/env node

// Offline-only guard for a Pages Functions build.
//
// This is intentionally standalone: it does not import the deployer, read
// credentials, make network requests, or change CI/deploy behaviour. A future
// caller can run it before handing an out/ directory to any transport.

import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const FUNCTION_EXTENSIONS = new Set([".cjs", ".js", ".mjs", ".ts", ".tsx"]);

function isRegularFile(path) {
  try {
    return lstatSync(path).isFile();
  } catch {
    return false;
  }
}

function walkFiles(root) {
  if (!existsSync(root)) return [];

  const files = [];
  const pending = [root];
  while (pending.length > 0) {
    const current = pending.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) pending.push(path);
      else if (entry.isFile()) files.push(path);
    }
  }
  return files.sort();
}

function sourceFunctionFiles(functionsDir) {
  return walkFiles(functionsDir).filter((path) =>
    FUNCTION_EXTENSIONS.has(extname(path).toLowerCase()),
  );
}

function toPosix(path) {
  return path.split(sep).join("/");
}

function sourceRouteRequirement(functionsDir, path) {
  const relativePath = toPosix(path.slice(functionsDir.length + 1));
  const extension = extname(relativePath);
  const withoutExtension = relativePath.slice(0, -extension.length);
  const parts = withoutExtension.split("/");
  const fileName = parts.at(-1);

  if (fileName === "_middleware") {
    const scope = parts.slice(0, -1).filter(Boolean);
    return {
      kind: "middleware",
      path: scope.length === 0 ? "/*" : `/${scope.join("/")}/*`,
      source: relativePath,
    };
  }

  if (fileName === "index") parts.pop();

  // Pages Functions dynamic segments are represented as a wildcard from the
  // first dynamic segment onward. This matches the conservative coverage
  // check without pretending to reproduce the platform's route compiler.
  const dynamicIndex = parts.findIndex((part) => /^\[.*\]$/.test(part));
  let routeParts = dynamicIndex === -1 ? parts : parts.slice(0, dynamicIndex);
  if (dynamicIndex !== -1) routeParts = [...routeParts, "*"];

  return {
    kind: "function",
    path: `/${routeParts.filter(Boolean).join("/")}` || "/",
    source: relativePath,
  };
}

function routePatternError(pattern, label) {
  if (typeof pattern !== "string" || pattern.length === 0) {
    return `${label} must be a non-empty string`;
  }
  if (!pattern.startsWith("/")) return `${label} must start with /`;
  if (/[\\\0\n\r\t?#]/.test(pattern)) {
    return `${label} contains a control character, query, fragment, or backslash`;
  }
  if (pattern.includes("//") || /(^|\/)\.{1,2}(\/|$)/.test(pattern)) {
    return `${label} contains an ambiguous path segment`;
  }
  if (/%(?:2e|2f|5c)/i.test(pattern)) {
    return `${label} contains encoded traversal or separator syntax`;
  }

  const wildcardCount = [...pattern].filter((character) => character === "*").length;
  if (wildcardCount > 1 || (wildcardCount === 1 && !pattern.endsWith("/*"))) {
    return `${label} may use only one terminal /* wildcard`;
  }

  return null;
}

function patternMatches(pattern, requiredPath) {
  if (typeof pattern !== "string") return false;
  if (pattern === "/*") return true;
  if (pattern.endsWith("/*")) {
    const base = pattern.slice(0, -2) || "/";
    return requiredPath === base || requiredPath.startsWith(`${base}/`);
  }
  return pattern === requiredPath;
}

function hasExecutableWorkerSource(contents) {
  const withoutComments = contents
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .trim();

  if (withoutComments.length < 16) return false;
  if (/^(?:export\s+default\s*\{\s*\}|module\.exports\s*=\s*\{\s*\};?)$/.test(withoutComments)) {
    return false;
  }
  return true;
}

function loadRoutes(routesPath, errors) {
  if (!isRegularFile(routesPath)) {
    errors.push("out/_routes.json is missing or not a regular file");
    return null;
  }

  let routes;
  try {
    routes = JSON.parse(readFileSync(routesPath, "utf8"));
  } catch (error) {
    errors.push(`out/_routes.json is not valid JSON (${error.message})`);
    return null;
  }

  if (!routes || typeof routes !== "object" || Array.isArray(routes)) {
    errors.push("out/_routes.json must contain an object");
    return null;
  }
  if (routes.version !== 1) {
    errors.push("out/_routes.json must declare version 1");
  }
  if (!Array.isArray(routes.include) || routes.include.length === 0) {
    errors.push("out/_routes.json must contain a non-empty include array");
  }
  if (routes.exclude !== undefined && !Array.isArray(routes.exclude)) {
    errors.push("out/_routes.json exclude must be an array when present");
  }

  for (const [key, patterns] of [["include", routes.include], ["exclude", routes.exclude ?? []]]) {
    if (!Array.isArray(patterns)) continue;
    for (const [index, pattern] of patterns.entries()) {
      const error = routePatternError(pattern, `out/_routes.json ${key}[${index}]`);
      if (error) errors.push(error);
    }
  }

  return routes;
}

export function runFunctionsPreservationPreflight(projectRoot, buildDirectory = "out") {
  const root = resolve(projectRoot);
  const functionsDir = join(root, "functions");
  const buildDir = resolve(root, buildDirectory);
  const files = sourceFunctionFiles(functionsDir);

  if (files.length === 0) {
    return {
      ok: true,
      staticOnly: true,
      message: "static-only build: no supported Pages Functions source files found",
    };
  }

  const errors = [];
  const workerPath = join(buildDir, "_worker.js");
  if (!isRegularFile(workerPath)) {
    errors.push("out/_worker.js is missing or not a regular file");
  } else {
    const worker = readFileSync(workerPath, "utf8");
    if (!hasExecutableWorkerSource(worker)) {
      errors.push("out/_worker.js is empty or contains only a placeholder");
    }
  }

  const routes = loadRoutes(join(buildDir, "_routes.json"), errors);
  const requirements = files.map((path) => sourceRouteRequirement(functionsDir, path));

  if (routes) {
    const includes = Array.isArray(routes.include) ? routes.include : [];
    const excludes = Array.isArray(routes.exclude) ? routes.exclude : [];

    for (const requirement of requirements) {
      const included = includes.some((pattern) => patternMatches(pattern, requirement.path));
      if (!included) {
        errors.push(
          `route coverage missing for ${requirement.kind} ${requirement.source}: ${requirement.path}`,
        );
        continue;
      }

      const excluded = excludes.find((pattern) => patternMatches(pattern, requirement.path));
      if (excluded) {
        errors.push(
          `route coverage excluded for ${requirement.kind} ${requirement.source}: ${excluded}`,
        );
      }
    }
  }

  if (errors.length > 0) {
    return {
      ok: false,
      staticOnly: false,
      errors,
      message: `Functions preservation preflight refused: ${errors.length} issue(s)`,
    };
  }

  return {
    ok: true,
    staticOnly: false,
    files: requirements,
    message: `Functions preservation preflight passed: ${requirements.length} source file(s) covered by compiled worker and routes`,
  };
}

function main() {
  const projectRoot = process.argv[2] ?? process.cwd();
  const buildDirectory = process.argv[3] ?? "out";
  const result = runFunctionsPreservationPreflight(projectRoot, buildDirectory);

  if (result.ok) {
    console.log(`✓ ${result.message}`);
    process.exitCode = 0;
    return;
  }

  console.error(`❌ ${result.message}`);
  for (const error of result.errors) console.error(`   - ${error}`);
  process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
