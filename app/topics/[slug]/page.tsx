// VERITAS-Reborn — /topics/[slug]/ topic hub detail.
//
// Each topic page bundles:
//   - Article (TechArticle) schema with full intro sections
//   - DefinedTermSet schema with terms relevant to the topic
//   - CollectionPage schema referencing every member claim
//   - BreadcrumbList schema
//   - Internal cross-links to other hubs + concept pillars + integrations

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { TOPICS, findTopic } from "@/lib/topics";
import { loadFullClaims } from "@/lib/claims-build";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const topic = findTopic(slug);
  if (!topic) return { title: "Topic not found — SourceScore VERITAS" };

  const canonical = `https://sourcescore.org/topics/${topic.slug}/`;
  return {
    title: { absolute: `${topic.title} — SourceScore VERITAS` },
    description: topic.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: topic.title,
      description: topic.metaDescription,
      url: canonical,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: topic.title, description: topic.metaDescription },
  };
}

export default async function TopicPage({ params }: PageParams) {
  const { slug } = await params;
  const topic = findTopic(slug);
  if (!topic) notFound();

  const all = await loadFullClaims();
  const members = all
    .filter(topic.claimFilter)
    .sort(
      (a, b) =>
        b.confidence - a.confidence ||
        a.subject.localeCompare(b.subject),
    );

  const canonical = `https://sourcescore.org/topics/${topic.slug}/`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: topic.title,
    description: topic.metaDescription,
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org/" },
    publisher: {
      "@type": "Organization",
      name: "SourceScore",
      logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" },
    },
    mainEntityOfPage: canonical,
    about: topic.definedTerms.map((t) => ({ "@type": "Thing", name: t.name })),
  };

  const definedTermSetSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: `${topic.title} — defined terms`,
    description: `Definitions for terms used in the ${topic.title} topic hub.`,
    url: canonical,
    hasDefinedTerm: topic.definedTerms.map((dt) => ({
      "@type": "DefinedTerm",
      name: dt.name,
      description: dt.description,
      inDefinedTermSet: canonical,
    })),
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: topic.title,
    description: topic.metaDescription,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: "SourceScore", url: "https://sourcescore.org/" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: members.length,
      itemListElement: members.map((c, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `https://sourcescore.org/claims/${c.id}/`,
        name: c.statement,
      })),
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Topics", url: "https://sourcescore.org/topics/" },
              { name: topic.title, url: canonical },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/topics/" className="hover:underline">Topics</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">{topic.title.split(" — ")[0]}</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Topic hub · {members.length} claims
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          {topic.title}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          {topic.subtitle}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none mb-12">
        {topic.sections.map((s, i) => (
          <div key={i}>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </div>
        ))}
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          Defined terms ({topic.definedTerms.length})
        </h2>
        <dl className="space-y-3">
          {topic.definedTerms.map((dt) => (
            <div
              key={dt.name}
              className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-4"
            >
              <dt className="font-semibold text-sm">{dt.name}</dt>
              <dd className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {dt.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          All claims in this topic ({members.length})
        </h2>
        <ul className="space-y-2 list-none pl-0">
          {members.map((c) => (
            <li
              key={c.id}
              className="border border-zinc-200 dark:border-zinc-800 rounded p-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <a
                href={`/claims/${c.id}/`}
                className="block text-sm hover:underline"
              >
                <span className="font-medium">{c.subject}</span>
                <span className="text-zinc-500 mx-1">·</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {c.predicate.replace(/_/g, " ")} {c.object}
                </span>
                <span className="text-zinc-400 text-xs ml-2">
                  ({c.confidence.toFixed(2)} · {c.sources.length} sources)
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {(topic.relatedHubs?.length || topic.relatedConcepts?.length || topic.relatedIntegrations?.length) && (
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <h2 className="text-lg font-semibold mb-4">Related</h2>
          {topic.relatedHubs && topic.relatedHubs.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-zinc-600 dark:text-zinc-400">
                Other topic hubs
              </h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                {topic.relatedHubs.map((slug) => {
                  const related = findTopic(slug);
                  return related ? (
                    <li key={slug}>
                      <a href={`/topics/${slug}/`} className="underline">
                        {related.title.split(" — ")[0]}
                      </a>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          )}
          {topic.relatedConcepts && topic.relatedConcepts.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-zinc-600 dark:text-zinc-400">
                Concept pillars
              </h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                {topic.relatedConcepts.map((slug) => (
                  <li key={slug}>
                    <a href={`/concepts/${slug}/`} className="underline capitalize">
                      {slug.replace(/-/g, " ")}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {topic.relatedIntegrations && topic.relatedIntegrations.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-zinc-600 dark:text-zinc-400">
                Framework integrations
              </h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                {topic.relatedIntegrations.map((slug) => (
                  <li key={slug}>
                    <a href={`/docs/integrations/${slug}/`} className="underline capitalize">
                      {slug.replace(/-/g, " ")}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </article>
  );
}
