import Image from "next/image";
import { FilmStage } from "@/components/film/FilmStage";
import { Beat, BeatEyebrow } from "@/components/film/Beat";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { getFaqs, getUniversities } from "@/lib/content";
import { universityLogos } from "@/data/logos";
import { mobileBeatSrc, filmBeats } from "@/data/filmBeats";
import { site } from "@/data/site";
import { organizationJsonLd } from "@/lib/jsonld";

/*
 * THE LONG OPEN — the homepage is one continuous shot.
 *
 * A laptop starts shut at the top of the page and opens across the entire scroll,
 * one doubt at a time, until it stands fully open behind the invitation to talk.
 * It never closes. The lid angle IS the page position: FilmStage interpolates it
 * between the beats below, in beat-map order (src/data/filmBeats.ts).
 *
 * The spine is the five questions families actually ask, in the order they ask
 * them. The current five are seeded from the FAQ content; Pratham is supplying
 * the real sequence from counselling conversations — when it lands, reorder the
 * beats AND the beat map together, then re-run scripts/build-frames.sh.
 */

const steps = [
  {
    n: "01",
    t: "tell us what you're after",
    d: "Message us on WhatsApp with what you'd like to study. No forms, no commitment.",
  },
  {
    n: "02",
    t: "we map your options",
    d: "A real counsellor compares programmes across our partner universities and confirms the real costs — in writing.",
  },
  {
    n: "03",
    t: "enrol with confidence",
    d: "Once you're sure it's right, we help you complete admission and get started online.",
  },
];

const costPoints = [
  "Exact fees and terms confirmed in writing before you apply",
  "Instalment options on many programmes",
  "Education-loan guidance where it applies",
  "No surprise charges, ever",
];

const beatHeading = "font-display font-medium lowercase tracking-[-0.03em] text-ink";
const beatHeadingSize = { fontSize: "clamp(1.9rem, 4vw, 2.9rem)", lineHeight: 1.0 };

export default function Home() {
  const faqs = getFaqs()
    .filter((f) => f.data.category === "general")
    .slice(0, 4);
  const partners = getUniversities().filter((u) => universityLogos[u.id]?.src);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />

      {/* The film container: the sticky stage is confined to it, so the machine
          slides away with the last beat instead of sticking under the footer. */}
      <div className="relative">
        <FilmStage />

        {/* ---- arrive · the machine is shut, the claim is made ------------------ */}
      <Beat id="arrive" side="center" still={false}>
        <div className="pt-6 pb-8 lg:pb-0 lg:pt-[4vh]">
          <p className="mb-5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink-faint max-sm:text-[0.62rem] max-sm:tracking-[0.12em]">
            Online UG &amp; PG degrees · UGC-recognised
          </p>
          <h1
            className="font-display font-semibold lowercase leading-[0.96] tracking-[-0.035em] text-ink"
            style={{ fontSize: "clamp(2.75rem, 7.5vw, 6rem)" }}
          >
            same degree<span className="text-accent">.</span>
            <br />
            now online<span className="text-accent">.</span>
          </h1>
        </div>

        {/* On a phone the shot opens on the closed machine, right under the claim. */}
        <Image
          src={mobileBeatSrc(0)}
          alt=""
          aria-hidden="true"
          width={760}
          height={489}
          priority
          sizes="(max-width: 640px) 88vw, 520px"
          className="mx-auto my-8 w-full max-w-[520px] lg:hidden"
        />

        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 pt-8 lg:pt-0 lg:pb-[5vh]">
          <p className="max-w-xl text-lg leading-relaxed text-ink-soft lg:hidden">
            Free, no-pressure counselling into UGC-recognised online degrees from Amity, LPU and
            other leading universities. We confirm the costs in writing — before you apply.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <WhatsAppButton label="Book free counselling" size="lg" />
            <Button href="/universities/" variant="secondary" size="lg">
              See universities
            </Button>
          </div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-faint">
            Free · No pressure · Based in India
          </p>
        </div>
      </Beat>

      {/* ---- trust · question 01: recognition ----------------------------------- */}
      <Beat id="trust">
        <BeatEyebrow n={1} label="recognition" />
        <h2 className={beatHeading} style={beatHeadingSize}>
          is the degree actually recognised?
        </h2>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
          Recognition is granted per programme, per mode, and per academic session — not to a
          university as a whole. So we don&apos;t make blanket claims. Each university page shows
          what we&apos;ve confirmed and what we&apos;re still verifying against UGC-DEB records.
        </p>
        <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
          Every programme we counsel into is the same qualification employers know — delivered
          online.
        </p>
        <div className="mt-7">
          <Button href="/universities/" variant="link" size="md">
            Check a university&apos;s status
          </Button>
        </div>
      </Beat>

      {/* ---- partners · question 02: the universities --------------------------- */}
      <Beat id="partners">
        <BeatEyebrow n={2} label="universities" />
        <h2 className={beatHeading} style={beatHeadingSize}>
          which universities would i choose from?
        </h2>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
          We counsel across all our partner universities, never just one. The right fit is the one
          that fits you.
        </p>
        <ul className="mt-8 grid max-w-md grid-cols-3 items-center gap-x-6 gap-y-7 sm:grid-cols-4 lg:grid-cols-3">
          {partners.map((u) => (
            <li key={u.id} className="relative h-9 opacity-85">
              <Image
                src={universityLogos[u.id]!.src!}
                alt={u.data.name}
                fill
                sizes="120px"
                className="object-contain object-left"
              />
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button href="/universities/" variant="secondary">
            See all universities
          </Button>
        </div>
      </Beat>

      {/* ---- process · question 03: who helps ----------------------------------- */}
      <Beat id="process">
        <BeatEyebrow n={3} label="the process" />
        <h2 className={beatHeading} style={beatHeadingSize}>
          who actually helps me through it?
        </h2>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
          A person, not a form. Three steps, with a real counsellor beside you at each one.
        </p>
        <ol className="mt-9 flex max-w-md flex-col gap-8">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-5">
              <span
                className="font-display text-3xl font-medium tabular-nums text-accent"
                aria-hidden="true"
              >
                {s.n}
              </span>
              <div>
                <h3 className="font-display text-xl font-medium lowercase tracking-[-0.02em] text-ink">
                  {s.t}
                </h3>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Beat>

      {/* ---- cost · question 04: money ------------------------------------------ */}
      <Beat id="cost">
        <BeatEyebrow n={4} label="the cost" />
        <h2 className={beatHeading} style={beatHeadingSize}>
          what will it really cost?
        </h2>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
          We confirm the exact fees and any financing terms in writing before you apply. No
          surprises later — and counselling itself costs nothing.
        </p>
        <ul className="mt-8 flex max-w-md flex-col gap-3.5">
          {costPoints.map((p) => (
            <li key={p} className="flex items-start gap-3 text-ink">
              <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 bg-accent" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button href="/financing/" variant="secondary">
            How financing works
          </Button>
        </div>
      </Beat>

      {/* ---- questions · question 05: everything else --------------------------- */}
      <Beat id="questions">
        <BeatEyebrow n={5} label="everything else" />
        <h2 className={beatHeading} style={beatHeadingSize}>
          what else should i be asking?
        </h2>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
          The things families ask us most, answered plainly.
        </p>
        <div className="mt-8 max-w-xl">
          <Accordion
            items={faqs.map((f) => ({ question: f.data.question, answer: f.data.answer }))}
          />
        </div>
        <div className="mt-7">
          <Button href="/faq/" variant="link" size="md">
            Read all FAQs
          </Button>
        </div>
      </Beat>

      {/* ---- invite · the machine stands fully open ------------------------------ */}
      {/* The machine holds the upper half of the viewport here and ALL the closing
          copy sits below it — never above or beside — so nothing ever scrolls
          through the lid on its way to its resting slot. */}
      <Beat id="invite" side="center" still={false} className="pb-28">
        {/* The phone's final still: fully open, facing the visitor. */}
        <Image
          src={mobileBeatSrc(filmBeats.length - 1)}
          alt=""
          aria-hidden="true"
          width={760}
          height={489}
          sizes="(max-width: 640px) 88vw, 520px"
          className="mx-auto mb-8 w-full max-w-[520px] lg:hidden"
        />
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 lg:mt-auto lg:pb-[5vh]">
          <h2
            className="max-w-2xl font-display font-medium lowercase tracking-[-0.03em] text-ink"
            style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", lineHeight: 1.02 }}
          >
            not sure where to start<span className="text-accent">?</span> that&apos;s exactly what
            we&apos;re for.
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-ink-soft">
            One message, and a real counsellor walks you through your options — free, and with no
            pressure to enrol.
          </p>
          <WhatsAppButton label="Book free counselling" size="lg" />
          <p className="text-sm text-ink-faint">{site.officeHours} · Based in India</p>
        </div>
      </Beat>
      </div>
    </>
  );
}
