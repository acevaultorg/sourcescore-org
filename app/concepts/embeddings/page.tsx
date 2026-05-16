// /concepts/embeddings/ — 6th concept pillar.
//
// High-volume search query: "what are embeddings", "embedding models",
// "vector embeddings explained". Targets the developer who has heard of
// embeddings but isn't sure what they actually are.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-16";
const TITLE = "Embeddings — definition, models, and how to choose";
const SUBTITLE =
  "Embeddings turn text (or images, audio, code) into dense numerical vectors. Similar inputs produce similar vectors. The retrieval backbone of RAG, semantic search, classification, and most LLM-era infrastructure.";
const SLUG = "embeddings";
const CANONICAL = `https://sourcescore.org/concepts/${SLUG}/`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: SUBTITLE,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: SUBTITLE,
    url: CANONICAL,
    type: "article",
    publishedTime: PUBLISHED,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: SUBTITLE },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: TITLE,
  description: SUBTITLE,
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  mainEntityOfPage: CANONICAL,
  author: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    url: "https://sourcescore.org",
  },
  publisher: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" },
  },
  about: [
    { "@type": "Thing", name: "Embeddings" },
    { "@type": "Thing", name: "Vector representations" },
    { "@type": "Thing", name: "Semantic search" },
    { "@type": "Thing", name: "RAG retrieval" },
  ],
};

const definedTermSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name: "Embedding",
  description:
    "A dense numerical vector representation of an input (text, image, audio, code) learned such that semantically similar inputs produce numerically similar vectors. Foundational to RAG retrieval, semantic search, classification, and clustering.",
  inDefinedTermSet: "https://sourcescore.org/concepts/",
  url: CANONICAL,
};

export default function EmbeddingsConcept() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Concepts", url: "https://sourcescore.org/concepts/" },
              { name: "Embeddings", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/concepts/" className="hover:underline">Concepts</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Embeddings</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Concept · {PUBLISHED}
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2 id="definition">Definition</h2>
        <p>
          An <strong>embedding</strong> is a dense numerical vector that
          represents an input — text chunk, image, audio clip, code
          snippet — such that semantically similar inputs produce
          numerically similar vectors.
        </p>
        <p>
          Concretely: text-embedding-3-small (OpenAI) maps any input
          string to a 1536-dimensional vector of floats. Two sentences
          about the same topic produce vectors with high cosine
          similarity (typically &gt; 0.7). Two unrelated sentences
          produce vectors with low cosine similarity (typically &lt; 0.3).
        </p>

        <h2 id="why-it-matters">Why it matters</h2>
        <p>
          Before embeddings, &quot;does this query relate to this
          document?&quot; required either keyword overlap (BM25, TF-IDF)
          or hand-engineered features. Embeddings learn the answer.
        </p>
        <p>
          Pretrained embedding models give you semantic retrieval for
          free: embed every document in your corpus once, embed each
          query at runtime, similarity-search returns the most relevant
          documents. This is the retrieval half of RAG.
        </p>

        <h2 id="history">A short history</h2>
        <p>
          The lineage:
        </p>
        <ul>
          <li>
            <strong>Word2Vec</strong> (<a href="/claims/">Mikolov et al., Google 2013</a>) —
            first widely-used neural word embeddings. Local-window
            objective; learns word-level vectors.
          </li>
          <li>
            <strong>GloVe</strong> (<a href="/claims/">Pennington, Socher,
            Manning, Stanford NLP 2014</a>) — global co-occurrence
            matrix factorization. Different objective, similar shape.
          </li>
          <li>
            <strong>ELMo</strong> (Peters et al. 2018) — first
            contextual embeddings; same word produces different vectors
            in different sentences.
          </li>
          <li>
            <strong>BERT</strong> (<a href="/claims/">Devlin et al.,
            Google 2018-2019</a>) — bidirectional transformer encoder;
            CLS-token output became the default sentence embedding for
            classification + retrieval.
          </li>
          <li>
            <strong>Sentence-BERT, sentence-transformers</strong>
            (Reimers + Gurevych 2019) — fine-tuned BERT specifically for
            sentence-level similarity. Made embeddings practical for RAG.
          </li>
          <li>
            <strong>OpenAI text-embedding-ada-002</strong> (2022) →
            text-embedding-3-small/large (2024). API-served, no
            self-hosting. Took over production.
          </li>
        </ul>

        <h2 id="how-to-use">How to use them</h2>
        <p>
          Three primary use cases:
        </p>
        <ol>
          <li>
            <strong>Semantic search.</strong> Embed all your documents,
            embed a query, return top-K nearest neighbors. The retrieval
            half of RAG.
          </li>
          <li>
            <strong>Classification.</strong> Embed labeled examples,
            train a small classifier (logistic regression, kNN) on the
            embeddings. Cheap; works surprisingly well.
          </li>
          <li>
            <strong>Clustering.</strong> Embed your corpus, run k-means
            or HDBSCAN. Discover thematic groups without labels.
          </li>
        </ol>

        <h2 id="how-to-choose">How to choose an embedding model</h2>
        <p>
          Three trade-offs:
        </p>
        <ul>
          <li>
            <strong>Quality vs cost.</strong> text-embedding-3-large
            (3072 dims) outperforms text-embedding-3-small (1536 dims)
            on most benchmarks but costs ~6× per token. Cohere
            embed-english-v3 is competitive. Open-weight: BGE-large,
            e5-large, gte-large.
          </li>
          <li>
            <strong>API vs self-host.</strong> OpenAI/Cohere/Voyage APIs
            are easiest. Self-hosting open-weight models (BGE, e5)
            saves money + keeps data on-prem; cost: GPU infrastructure.
          </li>
          <li>
            <strong>Dimensions vs storage.</strong> Higher dims = better
            quality but more storage + slower nearest-neighbor search.
            Matryoshka-style models (text-embedding-3) let you
            truncate dimensions if cost matters more than quality.
          </li>
        </ul>

        <h2 id="benchmarks">Benchmarks</h2>
        <p>
          The standard evaluation is <strong>MTEB</strong> (Massive Text
          Embedding Benchmark, Muennighoff et al. 2022) — 56 tasks
          across retrieval, classification, clustering. Check the
          live leaderboard at huggingface.co/spaces/mteb/leaderboard
          before picking. Top performers move around monthly.
        </p>
        <p>
          One caveat: MTEB is English-heavy. For multilingual production,
          test on your specific languages first. Some English-leaders
          underperform on lower-resource languages.
        </p>

        <h2 id="vector-databases">Storing + searching embeddings</h2>
        <p>
          You need a vector database (or vector index) to scale
          retrieval past ~10k documents. Options:
        </p>
        <ul>
          <li>
            <strong>FAISS</strong> (<a href="/claims/">Johnson, Douze,
            Jégou, Facebook AI 2017</a>) — library, not a database.
            Embed it in your app. Fastest; simplest.
          </li>
          <li>
            <strong>Pinecone</strong> (founded 2019) — managed cloud
            vector database. Easiest production deployment.
          </li>
          <li>
            <strong>Weaviate, Qdrant, Milvus, Chroma</strong> — open
            source + managed cloud. Trade-offs differ; for solo
            developers Qdrant + Chroma are the easiest local options.
          </li>
          <li>
            <strong>Postgres + pgvector</strong> — if you already have
            Postgres, the extension gives you vector search without
            adding another service.
          </li>
        </ul>

        <h2 id="anti-patterns">Common anti-patterns</h2>
        <ul>
          <li>
            <strong>Embedding raw documents whole.</strong> Use chunked
            embeddings (500-2000 token chunks); the larger the chunk
            the more semantically diluted the vector.
          </li>
          <li>
            <strong>Cosine similarity threshold = absolute relevance.</strong>{" "}
            0.7 cosine in one corpus means something different from
            0.7 in another. Calibrate per-corpus.
          </li>
          <li>
            <strong>Storing embeddings at full precision forever.</strong>{" "}
            Quantize old embeddings (8-bit, 4-bit) to save storage.
            Quality loss is small.
          </li>
          <li>
            <strong>Re-embedding everything when changing models.</strong>{" "}
            True, but expensive. Plan model upgrades with downtime
            budget allocated.
          </li>
        </ul>

        <h2 id="limits">What embeddings don&apos;t do</h2>
        <p>
          Embeddings are a similarity tool, not a verification tool.
          Two sentences can have high cosine similarity but contradict
          each other. The classic example:
        </p>
        <ul>
          <li>&quot;The model has 7B parameters.&quot;</li>
          <li>&quot;The model has 7B billion parameters.&quot;</li>
        </ul>
        <p>
          Cosine similarity ~ 0.99. Factual relationship: one is wrong.
          Embeddings retrieve; they don&apos;t verify. That&apos;s where
          <a href="/concepts/rag-vs-veritas/"> RAG vs VERITAS</a>{" "}
          enters: combine semantic retrieval (embeddings) with
          claim-level verification (VERITAS) to cover both axes.
        </p>

        <h2 id="related">Related</h2>
        <ul>
          <li><a href="/concepts/llm-grounding/">LLM grounding</a> — the broader frame</li>
          <li><a href="/concepts/rag-vs-veritas/">RAG vs VERITAS</a> — when embeddings aren&apos;t enough</li>
          <li><a href="/topics/rag-and-retrieval/">RAG + retrieval topic hub</a></li>
          <li><a href="/topics/foundational-papers/">Foundational papers — Word2Vec, GloVe, BERT</a></li>
          <li><a href="/docs/integrations/llamaindex/">LlamaIndex integration</a> — embedding-first RAG</li>
        </ul>
      </section>
    </article>
  );
}
