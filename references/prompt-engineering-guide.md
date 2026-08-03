# Prompt Engineering Reference

Source: [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) ([promptingguide.ai](https://www.promptingguide.ai/)) — MIT licensed, pure documentation (guides, papers, notebooks). No code to install, nothing to run. Pull from the live site when a technique below needs more depth than this summary.

Distilled to the techniques that actually apply to this business — WhatsApp lead handling (Auretris), the university FAQ database, and Kuanli once it's live. Not a copy of the guide; go to the source for anything not covered here.

## Techniques to use

**Few-shot prompting** — give Auretris 3-5 example exchanges (question → ideal answer) instead of one instruction. `references/voice.md` already has real samples; when scripting new auto-replies (fee breakdowns, eligibility, program comparisons), feed those samples as the few-shot set rather than describing the tone abstractly. Few-shot beats zero-shot every time the reply has a repeatable structure (bullet pricing, program summaries).

**RAG (retrieval-augmented generation)** — once the PostgreSQL FAQ database is wired in (see `connections.md` #7), Auretris should retrieve the matching FAQ row(s) and pass them into the prompt as grounding context, rather than relying on the model's memory of program details. This is the single highest-leverage technique available here: it's what stops the bot from inventing fee numbers or eligibility rules. Prioritize this over any other prompt-engineering work once the DB connection lands.

**Prompt chaining** — break "handle this lead" into stages instead of one mega-prompt: (1) classify intent (pricing / eligibility / application status / other), (2) retrieve grounding (RAG above), (3) draft reply in-voice, (4) decide next step (send brochure / ask qualifying question / escalate to human). Each stage is a smaller, more reliable prompt than one prompt trying to do all four. Maps directly onto the `lead-qualifier` skill (see below) and onto Kuanli task creation once that's live.

**Zero-shot + clear instructions** — fine for structured extraction tasks with no ambiguity (e.g., "pull the student's name, program of interest, and city from this WhatsApp thread"). Don't over-engineer these with few-shot examples; the guide's own finding is that zero-shot is enough when the task and output shape are unambiguous.

## Techniques that don't apply yet

- **Chain-of-thought / self-consistency / ToT** — built for multi-step reasoning and math/logic benchmarks. Nothing in the lead-handling or admissions workflow needs visible reasoning chains; skip these unless a future use case (e.g., counseling a student through a genuinely complex program-comparison decision) calls for it.
- **Agentic/tool-use patterns in the guide's later sections** — relevant only once Auretris or Kuanli calls out to tools mid-conversation (e.g., checking live seat availability). Revisit then.

## When to come back to this

- Re-read the RAG section on promptingguide.ai when the FAQ DB connection is actually built — this file gives the "why," the site gives the current best-practice implementation details.
- If Auretris reply quality drifts (generic, off-voice, or factually wrong answers), the fix is almost always "add few-shot examples" or "ground with RAG," in that order — check both before rewriting the whole prompt.
