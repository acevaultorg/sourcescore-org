export type AkVariant = 'v1' | 'v2' | 'v3' | 'v4' | 'v5';
export interface AkProduct { asin: string; name: string; why: string; tags?: string[]; onlyTagged?: boolean; w?: number }
export interface AkAdConfig { variant: AkVariant; products: AkProduct[]; disclosure: string; page?: string; api?: string; gate?: string; lang?: 'en' | 'nl'; labels?: Record<string, string>; n?: number }
export const VARIANTS: AkVariant[];
export const CACHE_TTL_S: number;
export const MAX_AGE_MS: number;
export const DISCLAIMER: string;
export const API_RESOURCES: string[];
export const AD_CSS: string;
export const AD_JS: string;
export const AD_HEAD_JS: string;
export const RANK_JS: string;
export function hash32(s: string): number;
export function utcDay(d?: Date): string;
export function candidatesFor(pool: AkProduct[], tags?: string[]): AkProduct[];
export function pickProducts(pool: AkProduct[], opts?: { page?: string; tags?: string[]; day?: string; n?: number; weights?: Record<string, number> }): AkProduct[];
export function validatePool(pool: AkProduct[]): string[];
export function validateAdConfig(cfg: AkAdConfig): string[];
export function parseItem(item: unknown): { title: string; brand: string; img: { url: string; w: number; h: number } | null; price: string | null } | null;
export function renderAd(cfg: AkAdConfig): string;
export function renderAdSlots(cfg: Omit<AkAdConfig, 'variant'>, opts?: { hostTag?: string }): { top: string; sticky: string; inContent: string; between: string };
export function makeItemsHandler(opts: { tag: string; allow: string[]; marketplace?: string; fetchImpl?: typeof fetch; cache?: unknown }): (ctx: { request: Request; env?: Record<string, string>; waitUntil?: (p: Promise<unknown>) => void }) => Promise<Response>;
export function makeGateHandler(opts: { tag: string; allow: string[]; host?: string }): (ctx: { request: Request }) => Response;
