// Amili Kit Amazon ad — this site's config (GENERATED from VAULT-Fleet tooling/fleet-kit/amazon-ad/pools/sourcescore.org.mjs).
// The tracking ID is NOT here: /go/amzad and /amz/items are served by the shared amili-amazon-ad Worker.
export default {
  "site": "sourcescore.org",
  "variant": "none",
  "skip": [
    "^/embed/",
    "^/api/"
  ],
  "placementAttrs": [
    "data-event-from",
    "data-from"
  ],
  "disclosure": "As an Amazon Associate, SourceScore earns from qualifying purchases at no extra cost to you.",
  "billboard": {
    "variant": "auto",
    "top": true,
    "mid": true,
    "midMove": true,
    "headline": "{why}",
    "midHeadline": "{why}"
  },
  "catalog": [
    {
      "asin": "0525509208",
      "name": "Calling Bullshit",
      "why": "Spot weak evidence and misleading numbers before you cite them."
    },
    {
      "asin": "0691249148",
      "name": "AI Snake Oil",
      "why": "What AI can and cannot do, from two Princeton researchers."
    },
    {
      "asin": "0393868338",
      "name": "The Alignment Problem",
      "why": "How machine learning systems learn the wrong lessons."
    },
    {
      "asin": "059371671X",
      "name": "Co-Intelligence",
      "why": "Working with AI without trusting it blindly."
    },
    {
      "asin": "0143125087",
      "name": "The Signal and the Noise",
      "why": "Why some predictions hold up and most do not."
    },
    {
      "asin": "0553418831",
      "name": "Weapons of Math Destruction",
      "why": "When data models mislead the people they rate."
    }
  ],
  "products": []
};
