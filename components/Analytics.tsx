// Analytics — Cloudflare Web Analytics beacon + the delegated event listener that
// replaced Plausible's tagged-events build (Plausible retired fleet-wide 2026-06-28).
// Microsoft Clarity + GA4 are loaded in app/layout.tsx; this listener feeds both.
//
// WHY A LISTENER: Plausible's `script.tagged-events` build read event names off CSS
// classes (`plausible-event-name=X plausible-event-source=Y`). Those classes were the
// ENTIRE event mechanism — there was not a single window.plausible() call on this site.
// Removing the script alone would have silently dropped all 22 conversion events with
// nothing in the diff to show for it. They are now `data-event` / `data-event-*`
// attributes, and this listener forwards them to Clarity + GA4.
//
// The listener is generic: `data-event` is the event name, and every other
// `data-event-<key>` becomes a prop (source, tool, …). Add a new tracked element by
// putting the attributes on it — no change needed here.
//
// CF Web Analytics stays env-gated: its token is account-specific with no safe fallback.

const CF_TOKEN = process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN;

const EVENT_DELEGATE = `
(function(){
  function fire(e){
    try{
      var el = e.target && e.target.closest && e.target.closest('[data-event]');
      if(!el) return;
      if(el.tagName === 'FORM' && e.type !== 'submit') return;
      var name = el.getAttribute('data-event');
      if(!name) return;
      var props = {}, d = el.dataset, k, pk;
      for(k in d){
        if(k === 'event' || k.indexOf('event') !== 0) continue;
        pk = k.slice(5);
        pk = pk.charAt(0).toLowerCase() + pk.slice(1);
        props[pk] = d[k];
      }
      if(window.clarity){
        clarity('event', name);
        for(k in props) clarity('set', k, String(props[k]));
      }
      if(window.gtag) gtag('event', name, props);
    }catch(_){}
  }
  document.addEventListener('click', fire, true);
  // middle-click opens in a new tab without firing 'click' in some browsers
  document.addEventListener('auxclick', function(e){ if(e.button === 1) fire(e); }, true);
  // Track keyboard and button form submissions once, at the form boundary.
  document.addEventListener('submit', fire, true);
})();
`;

export function Analytics() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: EVENT_DELEGATE }} />
      {CF_TOKEN ? (
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token":"${CF_TOKEN}"}`}
        />
      ) : null}
    </>
  );
}
