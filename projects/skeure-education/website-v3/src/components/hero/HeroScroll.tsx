"use client";

import { useEffect, useRef } from "react";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Button } from "@/components/ui/Button";

// Pinned scroll hero. A sticky stage stays fixed while you scroll through a tall
// track; scroll progress p (0→1) choreographs one continuous sequence:
//   p 0.00–0.30  laptop OPENS   (image sequence closed→open, painted to <canvas>)
//   p 0.38–0.60  heading TYPES onto the screen (scroll-driven typewriter)
//   p 0.60–0.74  supporting copy + CTAs rise in
//   p 0.74–0.82  hold (everything open + visible)
//   p 0.82–1.00  laptop CLOSES  (sequence reversed) and the text fades out
// The heading is locked to the laptop's screen: its box is positioned from the exact
// same cover-transform the canvas uses, so the text always sits inside the glass at any
// viewport, and the font scales to the visible screen width. Frames are an image
// sequence (no <video> seeking — Cloudflare Workers serve assets without HTTP range,
// which breaks paused-video scrubbing). Reduced-motion / no-JS: the stage rests OPEN
// with the full heading + copy shown, and the track collapses to one viewport.
const FRAME_COUNT = 61;
const frameSrc = (i: number) => `/render/frames/desktop/f-${String(i).padStart(3, "0")}.webp`;
const L1 = "same degree";
const L2 = "now online";
const TOTAL = L1.length + L2.length;
const POS_Y = 0.46; // vertical bias of the laptop within the frame (matches drawCover)
// the screen's black glass as a fraction of the source frame (1920×960)
const GLASS = { x0: 0.322, x1: 0.678, y0: 0.185, y1: 0.60 };
const seg = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)));

// Below this width the frame is fitted to the viewport WIDTH instead of covering it.
// Cover on a 2:1 frame in a portrait viewport scales to dw = h*2 — at 390×844 that is
// a 1688px-wide draw, i.e. a 4.3x zoom showing only the middle ~23% of the laptop,
// which is narrower than the 35.6%-wide screen glass the heading locks onto. Fitting
// to width instead shows the whole machine and keeps the glass fully on-screen.
// Must stay in lockstep with the `max-md:` poster variant on the canvas below —
// Tailwind's md breakpoint is 768px, and `max-md:` applies strictly BELOW it.
const NARROW_MAX = 768;
const NARROW_POS_Y = 0.3; // sit the laptop high so the copy + CTAs own the lower field
const isNarrow = () => window.innerWidth < NARROW_MAX;

// Scroll-progress windows for each beat, as [start, end] fractions of the track.
// Wide keeps the original choreography (open → type → copy → hold → close). Narrow
// drops the open/close beats entirely, so everything shifts earlier and the track
// gets shorter — 500vh of pinned scroll on a phone is five screens of thumb work
// before the first real content.
type Beat = readonly [start: number, end: number];
interface Timeline {
  scrim: Beat;
  eyebrow: Beat;
  type: Beat;
  body: Beat;
}
const T_WIDE: Timeline = {
  scrim: [0.34, 0.62],
  eyebrow: [0.22, 0.34],
  type: [0.38, 0.6],
  body: [0.6, 0.74],
};
const T_NARROW: Timeline = {
  scrim: [0.02, 0.2],
  eyebrow: [0.02, 0.12],
  type: [0.12, 0.46],
  body: [0.46, 0.68],
};
const TRACK_VH = { wide: 500, narrow: 260 };

export function HeroScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const screenBoxRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const l1Ref = useRef<HTMLSpanElement>(null);
  const l2Ref = useRef<HTMLSpanElement>(null);
  const p1Ref = useRef<HTMLSpanElement>(null);
  const p2Ref = useRef<HTMLSpanElement>(null);
  const c1Ref = useRef<HTMLSpanElement>(null);
  const c2Ref = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;

    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      images[i - 1] = img;
    }

    // Placement of the 2:1 frame inside the canvas box (in canvas pixels).
    // Wide viewports COVER (fill the box, crop the overflow). Narrow viewports fit to
    // WIDTH and letterbox vertically — see NARROW_MAX for why cover is unusable there.
    const cover = (w: number, h: number) => {
      const ir = 1920 / 960;
      let dw: number;
      let dh: number;
      if (isNarrow()) {
        dw = w;
        dh = w / ir;
      } else if (ir > w / h) {
        dh = h;
        dw = h * ir;
      } else {
        dw = w;
        dh = w / ir;
      }
      return { dx: (w - dw) / 2, dy: (h - dh) * (isNarrow() ? NARROW_POS_Y : POS_Y), dw, dh };
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    };

    // Fitting to width letterboxes the frame, and the render's studio field is a
    // lighter grey than the page background — which shows up as two hard seams above
    // and below the laptop. Sample the frame's own corner pixel once and flood the
    // canvas with it so the band reads as one continuous field instead. Sampled
    // rather than hardcoded so a re-render of the frames can't silently desync it.
    let fieldColor = "";
    const sampleField = (img: HTMLImageElement) => {
      if (fieldColor || !img.complete || !img.naturalWidth) return;
      const s = document.createElement("canvas");
      s.width = 1;
      s.height = 1;
      const sctx = s.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;
      sctx.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
      const [r, g, b] = sctx.getImageData(0, 0, 1, 1).data;
      fieldColor = `rgb(${r},${g},${b})`;
    };

    const drawCover = (img: HTMLImageElement | undefined) => {
      if (!img || !img.complete || !img.naturalWidth) return;
      const { dx, dy, dw, dh } = cover(canvas.width, canvas.height);
      sampleField(img);
      if (isNarrow() && fieldColor) {
        ctx.fillStyle = fieldColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    // lock the heading box onto the screen glass, sized to the visible screen width
    const positionHeading = () => {
      const box = screenBoxRef.current;
      if (!box) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const { dx, dy, dw, dh } = cover(w, h);
      const left = dx + GLASS.x0 * dw;
      const top = dy + GLASS.y0 * dh;
      const width = (GLASS.x1 - GLASS.x0) * dw;
      const height = (GLASS.y1 - GLASS.y0) * dh;
      box.style.left = `${left}px`;
      box.style.top = `${top}px`;
      box.style.width = `${width}px`;
      box.style.height = `${height}px`;
      const visW = Math.min(w, left + width) - Math.max(0, left);
      // The headline is `whitespace-nowrap`, so the ratio has to keep the longest
      // line ("same degree.") inside the glass rather than spilling onto the bezel.
      // Narrow needs a smaller ratio: the glass is only ~36% of a 390px viewport,
      // and at that size the original 0.118 pushed the line past both edges.
      const narrow = isNarrow();
      const f = Math.max(narrow ? 17 : 22, Math.min(104, visW * (narrow ? 0.101 : 0.118)));
      if (headingRef.current) headingRef.current.style.fontSize = `${f}px`;
      if (eyebrowRef.current) {
        eyebrowRef.current.style.fontSize = `${Math.max(narrow ? 7 : 9, f * 0.2)}px`;
        // 0.24em tracking on 22 characters overflows the narrow glass and wraps the
        // eyebrow onto a second line, crowding the headline. Tighten it there only.
        eyebrowRef.current.style.letterSpacing = narrow ? "0.12em" : "";
      }
    };

    const setText = (typedFrac: number) => {
      const shown = Math.round(typedFrac * TOTAL);
      const n1 = Math.min(shown, L1.length);
      const n2 = Math.max(0, Math.min(shown - L1.length, L2.length));
      if (l1Ref.current) l1Ref.current.textContent = L1.slice(0, n1);
      if (l2Ref.current) l2Ref.current.textContent = L2.slice(0, n2);
      if (p1Ref.current) p1Ref.current.style.opacity = shown >= L1.length ? "1" : "0";
      if (p2Ref.current) p2Ref.current.style.opacity = shown >= TOTAL ? "1" : "0";
      const onLine1 = shown < L1.length;
      const typing = typedFrac > 0 && typedFrac < 1;
      if (c1Ref.current) c1Ref.current.style.opacity = typing && onLine1 ? "1" : "0";
      if (c2Ref.current) c2Ref.current.style.opacity = typing && !onLine1 ? "1" : "0";
    };

    const render = (p: number) => {
      const narrow = isNarrow();
      const closing = narrow ? 0 : seg(p, 0.82, 1); // 0 until hold ends, →1 fully closed
      // Narrow viewports hold the laptop OPEN for the whole track. The open/close
      // choreography is the desktop centrepiece, but on a phone it costs two thirds
      // of the scroll to show a shut lid — the weakest possible first impression, and
      // the state a visitor is most likely to bounce from.
      const openFrac = narrow ? 1 : p <= 0.82 ? seg(p, 0, 0.3) : 1 - closing;
      drawCover(images[Math.round(openFrac * (FRAME_COUNT - 1))]);

      const fade = 1 - closing;
      // With no opening sequence to wait for, the narrow timeline starts almost
      // immediately — otherwise the first third of the track is a static open laptop.
      const t = narrow ? T_NARROW : T_WIDE;
      if (scrimRef.current) scrimRef.current.style.opacity = String(seg(p, ...t.scrim));
      const typedFrac = seg(p, ...t.type);
      setText(typedFrac);
      if (headingRef.current) headingRef.current.style.opacity = String(typedFrac > 0 ? fade : 0);
      if (eyebrowRef.current) eyebrowRef.current.style.opacity = String(seg(p, ...t.eyebrow) * fade);

      const bodyFrac = seg(p, ...t.body);
      if (bodyRef.current) {
        bodyRef.current.style.opacity = String(bodyFrac * fade);
        bodyRef.current.style.transform = `translateY(${(1 - bodyFrac) * 18}px)`;
      }
    };

    const showStatic = () => {
      sizeCanvas();
      positionHeading();
      const openImg = images[FRAME_COUNT - 1];
      const paint = () => drawCover(openImg);
      if (openImg.complete) paint();
      else openImg.onload = paint;
      if (l1Ref.current) l1Ref.current.textContent = L1;
      if (l2Ref.current) l2Ref.current.textContent = L2;
      [p1Ref, p2Ref, headingRef, eyebrowRef, bodyRef, scrimRef].forEach((r) => {
        if (r.current) r.current.style.opacity = "1";
      });
      if (c1Ref.current) c1Ref.current.style.opacity = "0";
      if (c2Ref.current) c2Ref.current.style.opacity = "0";
      if (bodyRef.current) bodyRef.current.style.transform = "none";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showStatic();
      return;
    }

    const setTrack = () => {
      section.style.height = `${isNarrow() ? TRACK_VH.narrow : TRACK_VH.wide}vh`;
    };
    setTrack(); // long track → slow, deliberate scrub (shorter on phones)
    sizeCanvas();
    positionHeading();
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const total = section.offsetHeight - window.innerHeight;
        const p = total > 0 ? Math.max(0, Math.min(1, -section.getBoundingClientRect().top / total)) : 0;
        render(p);
      });
    };
    const onResize = () => {
      setTrack(); // rotating a phone can cross NARROW_MAX in either direction
      sizeCanvas();
      positionHeading();
      onScroll();
    };
    if (images[0].complete) render(0);
    else images[0].onload = () => onScroll();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#eeedea]">
        {/* Laptop frame sequence — canvas paints over a poster fallback that shows
            until the first frame decodes. Each breakpoint gets the poster matching the
            state it actually rests in: wide starts closed and opens on scroll, narrow
            holds open throughout, so a closed poster there would flash a lid that never
            appears. Sizing mirrors the canvas transform (cover vs fit-width). */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full [background:url(/render/laptop-closed-poster.jpg)_50%_46%/cover_no-repeat] max-md:[background:url(/render/laptop-open-poster.jpg)_50%_30%/100%_auto_no-repeat]"
        />
        {/* light scrim so the copy + CTAs read where the laptop melts into the field */}
        <div
          ref={scrimRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[54%] [background:linear-gradient(transparent,var(--color-bg)_46%)]"
        />

        {/* heading — absolutely locked onto the laptop's screen glass (see positionHeading) */}
        <div
          ref={screenBoxRef}
          className="pointer-events-none absolute z-20 flex flex-col items-center justify-center gap-[0.5em] text-center"
        >
          <p
            ref={eyebrowRef}
            style={{ opacity: 0 }}
            className="font-mono uppercase leading-none tracking-[0.24em] text-white/65"
          >
            Online UG &amp; PG degrees
          </p>
          <div
            ref={headingRef}
            aria-hidden="true"
            style={{ opacity: 0, color: "#ffffff" }}
            className="font-semibold lowercase leading-[0.98] tracking-[-0.03em] [text-shadow:0_2px_30px_rgba(0,0,0,0.55)]"
          >
            <span className="whitespace-nowrap">
              <span ref={l1Ref}>same degree</span>
              <span ref={p1Ref} className="text-accent" style={{ opacity: 0 }}>
                .
              </span>
              <span ref={c1Ref} className="text-accent" style={{ opacity: 0 }}>
                ▋
              </span>
            </span>
            <br />
            <span className="whitespace-nowrap text-accent">
              <span ref={l2Ref}>now online</span>
              <span ref={p2Ref} className="text-white" style={{ opacity: 0 }}>
                .
              </span>
              <span ref={c2Ref} style={{ opacity: 0 }}>
                ▋
              </span>
            </span>
          </div>
        </div>

        {/* supporting copy + CTAs, pinned to the lower field */}
        <div
          ref={bodyRef}
          style={{ opacity: 0 }}
          /* Clear the WhatsApp FAB (fixed bottom-5, size-14 -> occupies up to 76px
             from the bottom, and it renders below lg). At bottom-[7vh] the trust line
             ran underneath it and read "…BASED IN I". */
          className="absolute inset-x-0 bottom-24 z-20 mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 text-center lg:bottom-[7vh]"
        >
          <p className="max-w-xl text-lg leading-relaxed text-ink-soft">
            Free, no-pressure counselling into UGC-recognised online degrees from Amity, LPU and other
            leading universities. We confirm the costs in writing — before you apply.
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
      </div>
    </section>
  );
}
