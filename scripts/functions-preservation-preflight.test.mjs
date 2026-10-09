#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const guard = resolve(dirname(fileURLToPath(import.meta.url)), "functions-preservation-preflight.mjs");
const worker = "export default { async fetch(request) { return new Response(request.url); } };\n";

function fixture(options = {}) {
  const functions = options.functions ?? { "api/v1/verify.js": "export function onRequest() {}\n" };
  const workerContents = Object.hasOwn(options, "workerContents") ? options.workerContents : worker;
  const routes = Object.hasOwn(options, "routes") ? options.routes : { version: 1, include: ["/*"] };
  const root = mkdtempSync(join(tmpdir(), "sourcescore-functions-preflight-"));
  const functionsRoot = join(root, "functions");
  const outputRoot = join(root, "out");
  mkdirSync(functionsRoot, { recursive: true });
  mkdirSync(outputRoot, { recursive: true });

  for (const [relativePath, contents] of Object.entries(functions)) {
    const path = join(functionsRoot, relativePath);
    mkdirSync(dirname(path), { recursive: true });
    if (contents === "SYMLINK") {
      const outside = join(root, "fixture-only-source.js");
      writeFileSync(outside, "export function onRequest() {}\n");
      symlinkSync(outside, path);
    } else writeFileSync(path, contents);
  }
  if (workerContents !== undefined) writeFileSync(join(outputRoot, "_worker.js"), workerContents);
  if (routes !== undefined) {
    writeFileSync(
      join(outputRoot, "_routes.json"),
      typeof routes === "string" ? routes : JSON.stringify(routes),
    );
  }
  return root;
}

function run(root) {
  return spawnSync(process.execPath, [guard, root], { encoding: "utf8" });
}

function assertRefused(root, expected) {
  const result = run(root);
  assert.notEqual(result.status, 0, `expected refusal, got:\n${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}\n${result.stderr}`, expected);
}

const roots = [];
try {
  {
    const root = fixture({
      functions: {
        "_middleware.js": "export async function onRequest(context) { return context.next(); }\n",
        "api/v1/verify.js": "export function onRequest() {}\n",
        "api/v1/usage/[api_key]/current.js": "export function onRequest() {}\n",
      },
      routes: { version: 1, include: ["/*"], exclude: [] },
    });
    roots.push(root);
    const result = run(root);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, /passed: 3 source file\(s\)/);
  }

  {
    const root = fixture({ functions: {} });
    roots.push(root);
    const result = run(root);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, /static-only/);
  }

  {
    const root = fixture({ workerContents: undefined });
    roots.push(root);
    assertRefused(root, /out\/_worker\.js is missing/);
  }

  {
    const root = fixture({ workerContents: "   \n// generated worker placeholder\n" });
    roots.push(root);
    assertRefused(root, /out\/_worker\.js is empty, placeholder/);
  }

  {
    const root = fixture({ routes: undefined });
    roots.push(root);
    assertRefused(root, /out\/_routes\.json is missing/);
  }

  {
    const root = fixture({ routes: "{not-json" });
    roots.push(root);
    assertRefused(root, /out\/_routes\.json is not valid JSON/);
  }

  {
    const root = fixture({ routes: { version: 1, include: ["api/*"] } });
    roots.push(root);
    assertRefused(root, /must start with \/|route coverage missing/);
  }

  {
    const root = fixture({ routes: { version: 1, include: ["/*/extra"] } });
    roots.push(root);
    assertRefused(root, /terminal \/\* wildcard/);
  }

  {
    const root = fixture({ routes: { version: 1, include: ["/*"], exclude: ["/api/*"] } });
    roots.push(root);
    assertRefused(root, /route coverage excluded/);
  }

  {
    const root = fixture({
      functions: { "admin/panel.js": "export function onRequest() {}\n" },
      routes: { version: 1, include: ["/api/*"] },
    });
    roots.push(root);
    assertRefused(root, /route coverage missing.*admin\/panel\.js/);
  }

  // Regression controls observed independently against rejected 668d992:
  // all ten original unsafe fixtures passed before the correction.
  const endpoint = { "api/verify.js": "export function onRequest() {}" };
  const dynamic = { "api/usage/[id]/current.js": "export function onRequest() {}" };
  for (const options of [
    { functions: endpoint, routes: {version: 1, include: ["/api/verify/*"]} },
    { functions: {"account/_middleware.js": "export function onRequest() {}"}, routes: {version: 1, include: ["/account/*"]} },
    { functions: endpoint, workerContents: "this definitely is not valid JavaScript" },
    { functions: endpoint, workerContents: 'const incidental = "not a worker module";' },
    { functions: dynamic, routes: {version: 1, include: ["/api/usage/*"], exclude: ["/api/usage/private/current"]} },
    { functions: dynamic, routes: {version: 1, include: ["/api/usage/*"], exclude: ["/api/usage/private/*"]} },
    { functions: {"_middleware.js": "export function onRequest() {}"}, routes: {version: 1, include: ["/*"], exclude: ["/protected/*"]} },
    { functions: {"account/_middleware.js": "export function onRequest() {}"}, routes: {version: 1, include: ["/account/*"], exclude: ["/account/private/*"]} },
    { functions: endpoint, routes: {version: 1, include: ["/*"], exclude: ["/api/verify/"]} },
    { functions: endpoint, routes: {version: 1, include: Array(101).fill("/*")} },
    { functions: endpoint, routes: {version: 1, include: ["/*"], exclude: ["/" + "x".repeat(101)]} },
    { functions: {"api/verify.js": "SYMLINK"}, workerContents: undefined, routes: undefined },
  ]) {
    const root = fixture(options);
    roots.push(root);
    assertRefused(root, /refused/i);
  }

  console.log("✓ functions-preservation-preflight: 22 focused offline cases passed");
} finally {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
}
