// /concepts/fine-tuning/ — 9th concept pillar.
//
// Targets high-volume "fine-tuning LLM", "LoRA vs full fine-tuning",
// "fine-tuning vs RAG", "instruction tuning", "RLHF", "DPO".
// Aleyda Solis 10-char #2 Useful + #4 Extractable + #8 Differentiated.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "Fine-tuning — the complete reference (LoRA, QLoRA, DPO, RLHF, PEFT)";
const SUBTITLE =
  "Definition, the seven canonical fine-tuning techniques (supervised, instruction, LoRA, QLoRA, RLHF, DPO, Constitutional AI), when to fine-tune vs ground via RAG, common failure modes, and the 2017-2024 timeline that produced modern fine-tuning practice.";
const CANONICAL = "https://sourcescore.org/concepts/fine-tuning/";
const PUBLISHED = "2026-05-17";

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
    url: "https://sourcescore.org/",
  },
  editor: {
    "@type": "Person",
    "@id": "https://sourcescore.org/about/#person-editorial-lead",
    name: "SourceScore Editorial Team",
    url: "https://sourcescore.org/about/",
  },
  publisher: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" },
  },
  about: [
    { "@type": "Thing", name: "Fine-tuning" },
    { "@type": "Thing", name: "LoRA" },
    { "@type": "Thing", name: "QLoRA" },
    { "@type": "Thing", name: "DPO" },
    { "@type": "Thing", name: "RLHF" },
    { "@type": "Thing", name: "Instruction tuning" },
    { "@type": "Thing", name: "Parameter-Efficient Fine-Tuning" },
  ],
};

const definedTermsSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Fine-tuning — defined terms",
  description: "Definitions for fine-tuning, LoRA, QLoRA, DPO, RLHF, PEFT, instruction tuning, and the related techniques covered in this pillar.",
  url: CANONICAL,
  hasDefinedTerm: [
    {
      "@type": "DefinedTerm",
      name: "Fine-tuning",
      description: "The process of taking a pre-trained foundation model and continuing training on a smaller, task-specific dataset to adapt the model's weights toward a specialized capability or behavior.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "LoRA (Low-Rank Adaptation)",
      description: "A parameter-efficient fine-tuning technique that freezes the base model weights and injects small trainable low-rank decomposition matrices into each transformer layer (Hu et al., Microsoft 2021).",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "QLoRA",
      description: "A memory-efficient variant of LoRA that quantizes the frozen base model to 4-bit precision and trains LoRA adapters on top, enabling fine-tuning of 65B-parameter models on a single 48GB GPU (Dettmers et al., University of Washington 2023).",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "DPO (Direct Preference Optimization)",
      description: "An alignment fine-tuning technique that directly optimizes a model on human preference data without explicitly training a reward model — simpler and more stable than RLHF (Rafailov et al., Stanford 2023).",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "RLHF (Reinforcement Learning from Human Feedback)",
      description: "A three-stage training procedure: (1) supervised fine-tuning on demonstrations, (2) reward model trained on human preference comparisons, (3) reinforcement learning (typically PPO) against the reward model. Foundational to ChatGPT, Claude, Llama-2-chat (Christiano et al. 2017; Ouyang et al. OpenAI 2022).",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "Instruction tuning",
      description: "Fine-tuning a pre-trained LM on (instruction, response) pairs to make it follow natural-language commands rather than just continue prefixes. Foundational to T5-Flan, InstructGPT, Alpaca.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "PEFT (Parameter-Efficient Fine-Tuning)",
      description: "Umbrella term for techniques that adapt large models by training a tiny fraction (often <1%) of parameters — includes LoRA, QLoRA, prefix tuning, adapter layers, IA3 (Houlsby et al. Google ICML 2019).",
      inDefinedTermSet: CANONICAL,
    },
  ],
};

export default function FineTuningPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Concepts", url: "https://sourcescore.org/concepts/" },
              { name: "Fine-tuning", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/concepts/" className="hover:underline">Concepts</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Fine-tuning</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Concept · Reference · 9th pillar
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>What is fine-tuning?</h2>
        <p>
          <strong>Fine-tuning</strong> is the process of taking a
          pre-trained foundation model and continuing training on a
          smaller, task-specific dataset to adapt the model&apos;s
          weights toward a specialized capability or behavior. The base
          model is fixed-cost (someone else trained it); the fine-tune
          is variable-cost (you train this one).
        </p>
        <p>
          Three things distinguish fine-tuning from prompting and from
          retrieval (RAG):
        </p>
        <ul>
          <li>
            <strong>Persistent change.</strong> The weights of the model
            change. The skill survives without the prompt.
          </li>
          <li>
            <strong>Inference cost is unchanged.</strong> A fine-tuned
            model is the same size as the base; same latency, same
            cost-per-token at inference.
          </li>
          <li>
            <strong>Data scale moderate.</strong> Hundreds to hundreds
            of thousands of examples — not the trillions used for
            pretraining.
          </li>
        </ul>

        <h2>The seven canonical fine-tuning techniques</h2>
        <ol>
          <li>
            <strong>Full supervised fine-tuning (SFT).</strong> Train
            all parameters end-to-end on (input, target) pairs. Most
            expressive, most expensive — needs the full GPU memory
            for the model + gradients + optimizer state.
          </li>
          <li>
            <strong>Instruction tuning.</strong> SFT specifically on
            (instruction, response) pairs to make the model follow
            commands instead of continuing prefixes. Foundational to
            T5-Flan (2022), InstructGPT (Ouyang et al. 2022), Alpaca
            (Stanford 2023).
          </li>
          <li>
            <strong>LoRA.</strong> Freeze base weights; inject small
            trainable low-rank matrices (rank 4-64 typical) into each
            attention layer. ~0.1% of full SFT parameters trained,
            within ~95% of SFT quality (Hu et al., Microsoft 2021).
          </li>
          <li>
            <strong>QLoRA.</strong> LoRA on top of a 4-bit-quantized
            base. Enables fine-tuning 65B-parameter models on a single
            48GB GPU — democratized hobbyist + research fine-tuning
            (Dettmers et al., U Washington 2023).
          </li>
          <li>
            <strong>RLHF.</strong> Three-stage: SFT → reward model on
            preference pairs → PPO RL against reward model.
            Foundational to ChatGPT, Claude, Llama-2-chat (Christiano
            et al. 2017; Ouyang et al. OpenAI 2022).
          </li>
          <li>
            <strong>DPO.</strong> Direct Preference Optimization —
            skips the reward-model + RL step. Optimizes preference
            directly via a closed-form loss. Simpler, more stable,
            now default in many open-weight chat models (Rafailov et
            al., Stanford 2023).
          </li>
          <li>
            <strong>Constitutional AI.</strong> Anthropic&apos;s
            RLAIF (RL from AI Feedback) — base model critiques and
            revises its own outputs against a constitution of
            principles, replacing human raters (Bai et al., Anthropic
            2022).
          </li>
        </ol>

        <h2>Fine-tune vs RAG: the decision tree</h2>
        <p>
          The most common AI-engineering question.{" "}
          <strong>Fine-tuning changes behavior. RAG changes context.</strong>
        </p>
        <ul>
          <li>
            <strong>Fine-tune when:</strong> the model needs to learn a
            style (tone, voice, format), a structured output schema,
            domain-specific vocabulary, or a multi-step reasoning
            pattern that no amount of prompting reliably elicits. The
            knowledge is small, stable, and worth burning into weights.
          </li>
          <li>
            <strong>RAG when:</strong> the knowledge is large, changes
            frequently, requires citation, or is too long to fit in
            context budget. Examples: customer-support docs that
            update weekly, legal corpus, internal knowledge base.
          </li>
          <li>
            <strong>Both when:</strong> domain-specific assistant
            (fine-tune for tone + reasoning) that retrieves
            domain-specific facts (RAG for current knowledge). Most
            production systems use both.
          </li>
        </ul>
        <p>
          See <a href="/concepts/rag-vs-veritas/" className="underline">RAG vs VERITAS</a>
          {" "}for the verification layer that augments both
          approaches.
        </p>

        <h2>Timeline — 2017 to 2024</h2>
        <ul>
          <li>
            <strong>2017</strong> · <em>Deep Reinforcement Learning from Human Preferences</em>
            {" "}(Christiano et al., OpenAI + DeepMind) — foundational paper
            introducing the preference-modeling pattern that becomes
            RLHF.
          </li>
          <li>
            <strong>2019</strong> · <em>Parameter-Efficient Transfer
            Learning</em> (Houlsby et al., Google ICML 2019) — adapter
            layers, the conceptual ancestor of LoRA.
          </li>
          <li>
            <strong>2021</strong> · <em>LoRA: Low-Rank Adaptation of
            Large Language Models</em> (Hu et al., Microsoft) — the
            paper that made PEFT mainstream.
          </li>
          <li>
            <strong>2022</strong> · <em>Training language models to
            follow instructions with human feedback</em> (Ouyang et al.,
            OpenAI) — InstructGPT, the paper that productionized RLHF
            and led directly to ChatGPT.
          </li>
          <li>
            <strong>2022</strong> · <em>Constitutional AI: Harmlessness
            from AI Feedback</em> (Bai et al., Anthropic) — RLAIF and
            Constitutional AI introduced.
          </li>
          <li>
            <strong>2023</strong> · <em>QLoRA: Efficient Finetuning of
            Quantized LLMs</em> (Dettmers et al., U Washington) —
            65B fine-tuning on a single GPU.
          </li>
          <li>
            <strong>2023</strong> · <em>Direct Preference Optimization:
            Your Language Model is Secretly a Reward Model</em>
            (Rafailov et al., Stanford) — DPO replaces the
            reward-model + RL stage of RLHF.
          </li>
          <li>
            <strong>2024-11</strong> · Tülu 3 (Allen AI) — open recipe
            replicating Llama 3 Instruct quality with full data + code
            + training-script transparency.
          </li>
        </ul>

        <h2>5 common fine-tuning failure modes</h2>
        <ol>
          <li>
            <strong>Catastrophic forgetting.</strong> Fine-tune teaches
            new skill but model loses general capabilities. Mitigation:
            include diverse general-capability data in training mix;
            use LoRA so base weights stay frozen.
          </li>
          <li>
            <strong>Overfitting on small data.</strong> &lt;500
            examples + full SFT = memorization, not generalization.
            Use LoRA + early stopping + held-out eval set.
          </li>
          <li>
            <strong>Reward hacking (RLHF/DPO).</strong> Model learns
            superficial features that score well on the reward model
            but produce worse outputs to humans. Mitigation: rotate
            preference annotators, KL penalty against the SFT
            checkpoint.
          </li>
          <li>
            <strong>Distribution mismatch.</strong> Training data is
            English-academic but production users speak casual
            multilingual. Eval shifts before behavior shifts.
          </li>
          <li>
            <strong>Hidden capability degradation.</strong> Fine-tune
            improves measured task but quietly degrades safety,
            reasoning, or multilingual abilities. Run a broad eval
            suite (per <a href="/concepts/evaluation-harness/" className="underline">evaluation harness</a>),
            not just the target task.
          </li>
        </ol>

        <h2>When NOT to fine-tune</h2>
        <ul>
          <li>
            <strong>You have &lt;100 examples.</strong> Use prompting +
            few-shot in-context examples instead.
          </li>
          <li>
            <strong>Your knowledge changes weekly.</strong> Use RAG —
            you don&apos;t want to re-train every Tuesday.
          </li>
          <li>
            <strong>You need citation.</strong> Fine-tuning bakes facts
            into weights; can&apos;t cite a weight. Use RAG +
            verification.
          </li>
          <li>
            <strong>The model already does the task.</strong> Many
            tasks people fine-tune for are solved by a better prompt
            or a different base model.
          </li>
          <li>
            <strong>You don&apos;t have eval data.</strong> Without an
            eval set you can&apos;t tell if fine-tuning helped or hurt.
            Skip the training; build the eval first.
          </li>
        </ul>

        <h2>Cost reality check (2024 pricing)</h2>
        <ul>
          <li>
            <strong>OpenAI gpt-4o fine-tune:</strong> ~$25 per 1M
            training tokens. Typical 10k-example dataset = ~$30-100
            run.
          </li>
          <li>
            <strong>Anthropic Claude fine-tune:</strong> available
            through Bedrock; pricing varies by base model. Custom
            partner agreements.
          </li>
          <li>
            <strong>Open-weight LoRA on rented GPU:</strong> Lambda
            Labs A100-80GB ~$1.10/hour. A 7B-parameter LoRA on 10k
            examples = ~2-4 hours = $3-5.
          </li>
          <li>
            <strong>QLoRA on consumer hardware:</strong> RTX 4090 24GB
            VRAM fine-tunes 13B-parameter models in QLoRA mode.
            Marginal-cost dominant for hobbyists.
          </li>
        </ul>

        <h2>Related</h2>
        <ul>
          <li>
            <a href="/concepts/llm-grounding/">LLM grounding</a> — the
            broader pattern, of which fine-tuning is one approach
          </li>
          <li>
            <a href="/concepts/rag-vs-veritas/">RAG vs VERITAS</a> — the
            other knowledge-injection approach
          </li>
          <li>
            <a href="/concepts/hallucination/">Hallucination</a> — the
            failure mode fine-tuning tries to reduce
          </li>
          <li>
            <a href="/concepts/evaluation-harness/">Evaluation harness</a>
            {" "}— how to test whether fine-tuning helped
          </li>
          <li>
            <a href="/topics/alignment-and-rlhf/">Topic hub: Alignment + RLHF</a>
            {" "}— catalog of alignment-related claims
          </li>
          <li>
            <a href="/use-cases/customer-support-bot/">Use case: customer-support bot</a>
            {" "}— where fine-tuning + RAG + verification combine
          </li>
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Considering fine-tuning + grounding? Browse the{" "}
          <a href="/claims/" className="underline">286 verified claims</a>
          {" "}or run the{" "}
          <a href="/quickstart/" className="underline">5-min quickstart</a>{" "}
          to add post-generation verification without retraining.
        </p>
      </footer>
    </article>
  );
}
