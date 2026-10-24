// VENDORED Amili Kit v1.17.10 (consent.mjs sha256 7ab5fd86888f) from VAULT-Fleet/tooling/fleet-kit/consent/consent.mjs — do not edit here; re-run sync.sh.
// Amili Kit: the cookie bar — @fleet/kit component (rewritten 1.12.0, Paulo mv4b…/mv50b1bpwjkakh: "cookie bar must be amili kit, like all elements, make the best cookie bar").
// CANONICAL: VAULT-Fleet/tooling/fleet-kit/consent/consent.mjs. Grown from the fleet's Consent Mode default (denied in
// the EEA/UK/CH/US-CA, granted elsewhere), Dagpeil's bar (refusing exactly as easy and as visible as accepting) and
// readglobe's (Escape, safe area, 44px). Sites that already carry the old Consent Mode defaults and a Clarity snippet get the bar
// through consent/inject.mjs (build-output injector, like the Amazon ad): it adds what is missing and touches nothing else.
//
//   import { renderConsent, consentHead, CONSENT_CSS, CONSENT_JS } from './kit/consent.mjs';
//   <head>: consentHead()  (BEFORE your gtag.js tag)      <body>: <style>CONSENT_CSS</style> renderConsent(opts) <script>CONSENT_JS</script>
//
// What the bar does (the whole contract, each line has a test):
//   - ONE plain sentence in the page language + a Privacy link. Two buttons, "Decline" and "Allow": same size, same style, same
//     weight, Decline first. Nothing is pre-selected, nothing is focused when it appears; the ring shows for keyboard focus only.
//   - "Details" (collapsed) opens two switches, all OFF: visit statistics (Google Analytics) and, where the site runs it, screen
//     recordings and heatmaps (Microsoft Clarity). "Save choice" stores what the switches say.
//   - Where the law asks (time zone Europe/*, the EU's overseas zones, California; an unknown zone asks) Google Consent Mode v2 is
//     DENIED before any tag loads and Clarity is not loaded at all until "Allow" (or its switch). Elsewhere the site's behaviour
//     is kept; the bar stays out of the way but the footer "Cookie settings" link opens it.
//   - The choice is kept 12 months, then asked again. Escape = Decline. Ad storage stays denied unless the site declares ads (opts.ads).
//   - Safe-area aware, compact at 390px, scrolls inside itself on a short screen, adds bottom padding to the page while it is
//     open so it never hides the end of a page, light and dark by the visitor's setting, WCAG AA (system colours).
//   - Nothing leaves the browser. No brand mark: this is legal UI.
//   - Ads sites (opts.ads, or any page that loads AdSense / Funding Choices: 1.17.1) and a certified CMP (1.17.0, Paulo 2026-10-22 "double cookie consent pop ups"): AdSense in the EEA/UK
//     shows Google's own consent message (TCF v2, window.__tcfapi). The bar waits up to 4 s for __tcfapi (then asks, and keeps looking 15 s more: a late CMP still takes over); where GDPR applies,
//     Google's message is the one choice, the bar never shows, and that choice drives analytics: granted only with TCF purpose 1
//     (storage) AND 8 or 9 (measurement). Ad consent stays Google's. Where GDPR does not apply, or no CMP loads (ad blocker), the
//     bar works as before. The footer "Cookie settings" opens Google's message while it is the CMP.
//
// renderConsent opts = {
//   lang: 'en'|'nl'|'de'|'fr'|'es'|'it'|'pt',            // default 'en'; any string field below overrides the table
//   policyHref: '/privacy/',
//   text, policyLabel, accept, reject, more, save, analytics, clarityLabel, label,
//   clarity: '<Clarity project id>',                      // adds the Clarity switch and lets "Allow" load the tag late
//   ads: false,                                           // true only when the site shows ads: Allow then also grants ad storage
//   ask: 'eu' | 'all',                                    // eu: only ask where the law requires it (time-zone test, below)
// }
// consentHead({ regions }) -> <script> that sets Consent Mode v2 defaults: denied in `regions` (default: EEA, UK, CH, US-CA),
// granted elsewhere, then applies a stored choice. Listen for the `ak-consent` event ({ detail: 'granted' | 'denied' })
// or read localStorage "ak-consent" ({ v, a: analytics, c: clarity, t }). `v` and the event detail are the ANALYTICS verdict only (Save with the
// analytics switch on stores v:'granted', c:false), so a site's own GA loader written for the old two-state bar keeps working unchanged.

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const EEA_UK_CH_CA = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH', 'US-CA'];
// Browser-side guess for "should we ask?": the device time zone. Europe/*, the EU's Atlantic and overseas zones, and
// America/Los_Angeles (California). A guess errs toward asking: an unknown zone asks.
export const ASK_ZONES = /^(Europe\/|Atlantic\/(Reykjavik|Faroe|Canary|Madeira|Azores|Jan_Mayen)|Arctic\/Longyearbyen|Africa\/Ceuta|Asia\/(Nicosia|Famagusta)|Indian\/(Reunion|Mayotte)|America\/(Guadeloupe|Martinique|Cayenne|St_Barthelemy|Marigot|Los_Angeles))/;
export const KEEP_MS = 31536e6; // 12 months

export const STRINGS = {
  en: { label: 'Cookie choice', text: 'We use analytics cookies to learn which pages help.', policy: 'Privacy', reject: 'Decline', accept: 'Allow', more: 'Details', save: 'Save choice', analytics: 'Visit statistics (Google Analytics)', clarity: 'Screen recordings and heatmaps (Microsoft Clarity)', settings: 'Cookie settings', textAds: 'We use cookies for visit statistics and ads.', analyticsAds: 'Visit statistics and ads (Google Analytics, Google AdSense)' },
  nl: { label: 'Cookiekeuze', text: 'Mogen we analytische cookies gebruiken om te zien welke pagina’s helpen?', policy: 'Privacy', reject: 'Weigeren', accept: 'Toestaan', more: 'Details', save: 'Keuze opslaan', analytics: 'Bezoekcijfers (Google Analytics)', clarity: 'Schermopnames en heatmaps (Microsoft Clarity)', settings: 'Cookie-instellingen', textAds: 'Mogen we cookies gebruiken voor bezoekcijfers en advertenties?', analyticsAds: 'Bezoekcijfers en advertenties (Google Analytics, Google AdSense)' },
  de: { label: 'Cookie-Auswahl', text: 'Dürfen wir Analyse-Cookies nutzen, um zu sehen, welche Seiten helfen?', policy: 'Datenschutz', reject: 'Ablehnen', accept: 'Erlauben', more: 'Details', save: 'Auswahl speichern', analytics: 'Besucherstatistik (Google Analytics)', clarity: 'Bildschirmaufzeichnungen und Heatmaps (Microsoft Clarity)', settings: 'Cookie-Einstellungen', textAds: 'Dürfen wir Cookies für Besucherstatistik und Werbung nutzen?', analyticsAds: 'Besucherstatistik und Werbung (Google Analytics, Google AdSense)' },
  fr: { label: 'Choix des cookies', text: 'Pouvons-nous utiliser des cookies d’analyse pour voir quelles pages aident ?', policy: 'Confidentialité', reject: 'Refuser', accept: 'Autoriser', more: 'Détails', save: 'Enregistrer mon choix', analytics: 'Statistiques de visite (Google Analytics)', clarity: 'Enregistrements d’écran et cartes de chaleur (Microsoft Clarity)', settings: 'Paramètres des cookies', textAds: 'Pouvons-nous utiliser des cookies pour les statistiques de visite et la publicité ?', analyticsAds: 'Statistiques de visite et publicité (Google Analytics, Google AdSense)' },
  es: { label: 'Elección de cookies', text: '¿Podemos usar cookies de análisis para ver qué páginas ayudan?', policy: 'Privacidad', reject: 'Rechazar', accept: 'Permitir', more: 'Detalles', save: 'Guardar elección', analytics: 'Estadísticas de visitas (Google Analytics)', clarity: 'Grabaciones de pantalla y mapas de calor (Microsoft Clarity)', settings: 'Ajustes de cookies', textAds: '¿Podemos usar cookies para estadísticas de visitas y anuncios?', analyticsAds: 'Estadísticas de visitas y anuncios (Google Analytics, Google AdSense)' },
  it: { label: 'Scelta dei cookie', text: 'Possiamo usare cookie di analisi per capire quali pagine sono utili?', policy: 'Privacy', reject: 'Rifiuta', accept: 'Consenti', more: 'Dettagli', save: 'Salva scelta', analytics: 'Statistiche di visita (Google Analytics)', clarity: 'Registrazioni dello schermo e mappe di calore (Microsoft Clarity)', settings: 'Impostazioni cookie', textAds: 'Possiamo usare cookie per le statistiche di visita e la pubblicità?', analyticsAds: 'Statistiche di visita e pubblicità (Google Analytics, Google AdSense)' },
  pt: { label: 'Escolha de cookies', text: 'Podemos usar cookies de análise para ver que páginas ajudam?', policy: 'Privacidade', reject: 'Recusar', accept: 'Permitir', more: 'Detalhes', save: 'Guardar escolha', analytics: 'Estatísticas de visitas (Google Analytics)', clarity: 'Gravações de ecrã e mapas de calor (Microsoft Clarity)', settings: 'Definições de cookies', textAds: 'Podemos usar cookies para estatísticas de visitas e anúncios?', analyticsAds: 'Estatísticas de visitas e anúncios (Google Analytics, Google AdSense)' },
};
export const langOf = (l) => { const k = String(l || 'en').toLowerCase().slice(0, 2); return STRINGS[k] ? k : 'en'; };
export const settingsLabel = (lang) => STRINGS[langOf(lang)].settings;

export function consentHead({ regions = EEA_UK_CH_CA } = {}) {
  if (!Array.isArray(regions) || regions.some((r) => !/^[A-Z]{2}(-[A-Z0-9]{1,3})?$/.test(r))) throw new Error('consentHead: regions must be ISO codes like "NL" or "US-CA"');
  const denied = "ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'";
  const granted = "ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'";
  // A stored choice: analytics follows the "a" flag (older records have only "v"); ad storage is only ever granted by the bar when the site declares ads, so here it stays as the default says.
  return `<script>window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};`
    + `gtag('consent','default',{${denied},wait_for_update:500,region:${JSON.stringify(regions).replace(/"/g, "'")}});`
    + `gtag('consent','default',{${granted}});`
    + `(function(){try{var c=JSON.parse(localStorage.getItem('ak-consent')||'null');if(c&&Date.now()-c.t<${KEEP_MS}){var a=c.a===undefined?c.v==='granted':!!c.a;gtag('consent','update',c.src==='tcf'?{analytics_storage:a?'granted':'denied'}:{analytics_storage:a?'granted':'denied',ad_storage:c.ads&&a?'granted':'denied',ad_user_data:c.ads&&a?'granted':'denied',ad_personalization:c.ads&&a?'granted':'denied'})}}catch(e){}})();</script>`;
}

export function renderConsent(o = {}) {
  const ask = o.ask === 'all' ? 'all' : 'eu';
  const S = STRINGS[langOf(o.lang)];
  const clarity = /^[a-z0-9]{6,16}$/i.test(o.clarity || '') ? o.clarity : '';
  const t = (k, ok) => esc(o[ok || k] != null ? o[ok || k] : S[k]);
  return `<div class="ak-cc" role="region" aria-label="${t('label')}" data-ask="${ask}" data-ads="${o.ads ? 1 : 0}"${clarity ? ` data-clarity="${clarity}"` : ''} hidden><div class="ak-cc-in">`
    + `<p class="ak-cc-t">${o.ads ? t('textAds', 'text') : t('text')} <a href="${esc(o.policyHref || '/privacy/')}">${t('policy', 'policyLabel')}</a> <button type="button" class="ak-cc-more" aria-expanded="false" aria-controls="ak-cc-d">${t('more')}</button></p>`
    + `<div class="ak-cc-b"><button type="button" data-ak-cc="denied">${t('reject')}</button><button type="button" data-ak-cc="granted">${t('accept')}</button></div>`
    + `<div class="ak-cc-d" id="ak-cc-d" hidden>`
    + `<label><input type="checkbox" data-ak-t="a"><span>${o.ads ? t('analyticsAds', 'analyticsLabel') : t('analytics')}</span></label>`
    + (clarity ? `<label><input type="checkbox" data-ak-t="c"><span>${t('clarity', 'clarityLabel')}</span></label>` : '')
    + `<button type="button" data-ak-cc="custom">${t('save')}</button></div>`
    + `</div></div>`;
}

export const CONSENT_CSS = `.ak-cc{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;max-height:85vh;overflow:auto;color-scheme:light dark;padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--ak-bg,Canvas);color:var(--ak-fg,CanvasText);border-top:1px solid var(--ak-line,color-mix(in srgb,currentColor 16%,transparent));box-shadow:0 -8px 24px rgba(0,0,0,.12);font:400 .9375rem/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.ak-cc[hidden]{display:none}
.ak-cc-in{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;max-width:var(--ak-max,60rem);margin:0 auto}
.ak-cc-t{flex:1 1 20rem;margin:0}
.ak-cc-t a{color:inherit;text-decoration:underline;text-underline-offset:.2em;display:inline-block;padding:12px 0;margin:-12px 0}
.ak-cc-more{display:inline-block;margin:-12px 0 -12px 4px;padding:12px 4px;border:0;background:none;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:.2em;cursor:pointer}
.ak-cc-b{display:flex;gap:8px;flex:1 1 14rem;max-width:22rem}
.ak-cc button{font:inherit}
.ak-cc-b button,.ak-cc-d>button{flex:1 1 0;min-height:44px;padding:0 16px;border:1px solid currentColor;border-radius:10px;background:transparent;color:inherit;font-weight:600;cursor:pointer}
.ak-cc-b button:hover,.ak-cc-d>button:hover{background:color-mix(in srgb,currentColor 8%,transparent)}
.ak-cc button:focus:not(:focus-visible){outline:none}
.ak-cc button:focus-visible,.ak-cc a:focus-visible,.ak-cc input:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.ak-cc-d{flex:1 1 100%;display:flex;flex-direction:column;gap:4px}
.ak-cc-d[hidden]{display:none}
.ak-cc-d label{display:flex;align-items:center;gap:12px;min-height:44px;cursor:pointer}
.ak-cc-d input{width:22px;height:22px;flex:none;margin:0;accent-color:currentColor}
.ak-cc-d>button{flex:none;align-self:flex-start;min-width:11rem}
@media (max-width:600px){.ak-cc{font-size:.8125rem;line-height:1.3;padding:6px 12px calc(6px + env(safe-area-inset-bottom,0px))}.ak-cc-in{gap:2px 8px}.ak-cc-t{flex-basis:100%}.ak-cc-b{flex-basis:100%;max-width:none;gap:8px}.ak-cc-d>button{align-self:stretch}}
@media print{.ak-cc{display:none}}`;

// Shows the bar when no fresh choice exists (and, with ask="eu", only where the time zone says the law asks for it).
// Decline, Allow, Save (with the switches), Escape (= decline) and any [data-cc="show"] element (the footer's "Cookie settings") work.
// Choosing stores {v,a,c,t}, updates Consent Mode, loads Clarity ONLY now (when the visitor allowed it and the page did not already run it)
// and tells it (consentv2), pads the page while the bar is open, and fires `ak-consent` on window.
export const CONSENT_JS = `(function(){"use strict";var KEY="ak-consent",MAX=${KEEP_MS},
ZONES=${ASK_ZONES.toString()};
var bar=document.querySelector(".ak-cc");if(!bar)return;
var CID=bar.getAttribute("data-clarity")||"",ADS=bar.getAttribute("data-ads")==="1",CMP=ADS||!!document.querySelector('script[src*="adsbygoogle"],script[src*="fundingchoices"]');
function rec(){try{var c=JSON.parse(localStorage.getItem(KEY)||"null");if(c&&Date.now()-c.t<MAX){var a=c.a===undefined?c.v==="granted":!!c.a;return{v:c.v,a:a,c:c.c===undefined?a:!!c.c,tcf:c.src==="tcf"}}}catch(e){}return null}
function stored(){var r=rec();return r?r.v:null}
function mustAsk(){if(bar.getAttribute("data-ask")==="all")return true;try{var z=Intl.DateTimeFormat().resolvedOptions().timeZone||"";return !z||ZONES.test(z)}catch(e){return true}}
function pad(on){try{document.body.style.paddingBottom=on?bar.offsetHeight+"px":""}catch(e){}}
function boxes(){return bar.querySelectorAll("[data-ak-t]")}
function fill(){var r=rec(),i,b=boxes();for(i=0;i<b.length;i++)b[i].checked=!!(r&&r[b[i].getAttribute("data-ak-t")])}
function show(){fill();bar.hidden=false;pad(true)}
function tagged(){return !!document.querySelector('script[src*="clarity.ms/tag/"]')}
function clarity(on){if(!CID)return;var g=on?"granted":"denied";
if(on&&!tagged()){window.clarity=function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};var s=document.createElement("script");s.async=1;s.src="https://www.clarity.ms/tag/"+CID;(document.head||document.documentElement).appendChild(s)}
if(window.clarity)try{window.clarity("consentv2",{ad_Storage:g,analytics_Storage:g})}catch(e){}}
function apply(a,c){var g=a?"granted":"denied",ad=a&&ADS?"granted":"denied";
if(window.gtag)window.gtag("consent","update",{analytics_storage:g,ad_storage:ad,ad_user_data:ad,ad_personalization:ad});clarity(c)}
function choose(v){var a,c,i,b;
if(v==="custom"){a=false;c=false;b=boxes();for(i=0;i<b.length;i++){if(b[i].checked){if(b[i].getAttribute("data-ak-t")==="a")a=true;else c=true}}}
else{a=v==="granted";c=a}
v=a?"granted":"denied";
try{localStorage.setItem(KEY,JSON.stringify({v:v,a:a,c:c,ads:ADS,t:Date.now()}))}catch(e){}
bar.hidden=true;pad(false);apply(a,c);
try{window.dispatchEvent(new CustomEvent("ak-consent",{detail:v}))}catch(e){}}
bar.addEventListener("click",function(e){var t=e.target,m=t.closest&&t.closest(".ak-cc-more");
if(m){var d=bar.querySelector(".ak-cc-d"),o=d.hidden;d.hidden=!o;m.setAttribute("aria-expanded",o?"true":"false");pad(true);return}
var v=t.closest&&t.closest("[data-ak-cc]");if(v)choose(v.getAttribute("data-ak-cc"))});
bar.addEventListener("keydown",function(e){if(e.key==="Escape")choose("denied")});
var TCF=0;
function settings(){if(TCF===1&&window.googlefc&&typeof window.googlefc.showRevocationMessage==="function"){try{window.googlefc.showRevocationMessage();return}catch(e){}}show()}
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest('[data-cc="show"]');if(t){e.preventDefault();settings()}});
function ask(){if(!rec()&&mustAsk())show()}
function tcfSeen(d){if(!d)return;if(d.gdprApplies===false){if(TCF===0){TCF=-1;ask()}return}
TCF=1;bar.hidden=true;pad(false);
if(d.eventStatus!=="tcloaded"&&d.eventStatus!=="useractioncomplete")return;
var p=d.purpose&&d.purpose.consents||{},a=!!(p[1]&&(p[8]||p[9]));
try{localStorage.setItem(KEY,JSON.stringify({v:a?"granted":"denied",a:a,c:a,ads:ADS,src:"tcf",t:Date.now()}))}catch(e){}
if(window.gtag)window.gtag("consent","update",{analytics_storage:a?"granted":"denied"});clarity(a);
try{window.dispatchEvent(new CustomEvent("ak-consent",{detail:a?"granted":"denied"}))}catch(e){}}
function tcf(){try{window.__tcfapi("addEventListener",2,function(d,ok){if(ok)tcfSeen(d)})}catch(e){if(TCF===0){TCF=-1;ask()}}}
var r=rec();if(r){if(r.tcf){if(window.gtag)window.gtag("consent","update",{analytics_storage:r.a?"granted":"denied"});clarity(r.c)}else apply(r.a,r.c)}
if(CMP){var T=typeof setTimeout==="function"?setTimeout:null,n=0;
(function wait(){if(typeof window.__tcfapi==="function"){TCF=TCF===-1?0:TCF;tcf();return}
if(!T)return ask();++n;if(n===41&&TCF===0){TCF=-1;ask()}if(n>70)return;T(wait,n>40?500:100)})()}
else ask();
window.akConsent={show:settings,choose:choose,get:stored};})();`;

// The kit's common shape: every component exports { name, render(opts) -> html, css, js } (+ head() for <head>).
export default { name: 'consent', title: 'Consent bar', render: renderConsent, head: consentHead, css: CONSENT_CSS, js: CONSENT_JS };
