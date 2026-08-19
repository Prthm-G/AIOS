"use client";

import { useEffect, useRef, useState } from "react";
import { filmBeats, FRAME_COUNT, desktopFrameSrc } from "@/data/filmBeats";
import glassTable from "@/data/glassTable.json";

/**
 * THE LONG OPEN — the scrub engine.
 *
 * One laptop opens across the entire homepage. It starts shut at the top and it is
 * fully open at the bottom, and it never closes on the way. That single rule is what
 * makes this a continuous shot rather than a stack of sections: the lid angle encodes
 * how far down the page you are, so reordering two sections desynchronises the film
 * from the content and the page visibly breaks.
 *
 * Progress is not a linear fraction of the container. It is driven by the beat
 * sections themselves — each beat id in the page contributes an anchor at the point
 * its top crosses 55% of the viewport, and the lid interpolates between the `open`
 * values in the beat map. Sections can therefore be any height and the lid still
 * matches whatever is on screen.
 *
 * WHAT THIS FIXES FROM v3, deliberately:
 *  - v3 ran closed -> open -> closed, so scroll 0% and 100% drew the same file. Here
 *    `open` is monotonic by construction and asserted in development.
 *  - v3 constructed all 61 Image objects before checking viewport or reduced-motion,
 *    so phones downloaded 1.24MB to draw one frame. Here nothing is fetched until
 *    after both checks pass, and phones never enter this loading path at all — they
 *    get seven stills rendered by the Beat sections (see Beat.tsx).
 *  - v3 decoded on the scroll thread. Here every frame is decode()'d on arrival, so
 *    drawImage only ever blits an already-decoded bitmap.
 *  - v3 had no way to be verified without a person looking at it. Here `?jump=<0..1>`
 *    lands pre-scrolled with scroll state settled, and `window.__ready` flips true
 *    once the first frame is actually on the canvas.
 */

// Geometry of the machine inside the 1920x960 source frame, measured off the render.
const FRAME_W = 1920;
const FRAME_H = 960;
const MACHINE = { w: 1040, h: 800, cx: 960, cy: 500 };
// The screen glass per frame, MEASURED off the graded frames (dark-run scan down
// the centre columns, clamped at the hinge line y=0.60 — the camera is locked, so
// the hinge is a fixed line). Frames where the lid is too shut to show glass have
// no entry, which is also the readout's on/off switch. See the audit session notes
// for the sampler; regenerate if the frames are re-rendered.
const GLASS_TABLE = glassTable as Record<string, { y0: number; y1: number; x0: number; x1: number }>;
/** A beat becomes current when its top reaches this much of the viewport. */
const ANCHOR = 0.55;
const WIDE = "(min-width: 1024px)";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** The dev contract's readiness flag. Harnesses poll this instead of guessing. */
function markReady() {
  (window as unknown as { __ready?: boolean }).__ready = true;
  document.documentElement.dataset.filmReady = "1";
}

interface Placement {
  /** Machine width in CSS pixels, and its centre. */
  mw: number;
  mcx: number;
  mcy: number;
}

const AR = MACHINE.w / MACHINE.h; // machine bbox aspect, width / height

/**
 * Where the machine sits at film progress q (0 at the first beat, 1 at the last).
 * The machine is a BACKDROP: always centred, behind the content, washed toward the
 * page colour while the questions are read (see washFor). It is never laid out
 * beside the text as a foreground object.
 *
 * The two bookends are placed from the viewport's actual vertical budget, not from
 * fixed fractions — fixed fractions are exactly what put the hero CTAs on the slab
 * at 800px-tall viewports and the invite heading through the keyboard at 768:
 *  - arrive: the machine bbox bottom is held 210px above the fold so the CTA block
 *    always clears the closed slab (the slab is the bbox's lower third).
 *  - invite: the bbox bottom is held 360px above the fold so the closing copy block
 *    below it always fits.
 */
function placement(q: number, vw: number, vh: number): Placement {
  const size = (fw: number, fh: number) => Math.min(vw * fw, vh * fh * AR);
  const below = (mw: number, clearance: number) => {
    const mh = mw / AR;
    // centre the bbox so its bottom edge sits `clearance` above the fold, but never
    // let it poke above the viewport top
    return Math.max(mh / 2 + 24, vh - clearance - mh / 2);
  };

  const arriveW = size(0.56, 0.44);
  const ambientW = size(0.6, 0.5);
  const inviteW = size(0.46, 0.42);
  const arrive: Placement = {
    mw: arriveW,
    mcx: vw * 0.5,
    mcy: Math.min(vh * 0.56, below(arriveW, 210)),
  };
  const ambient: Placement = { mw: ambientW, mcx: vw * 0.5, mcy: vh * 0.5 };
  // 440 = the invite copy block measured at rest (heading + copy + CTA + hours +
  // gaps ≈ 320px) plus the section's lg bottom padding (96px) and a shadow margin.
  const invite: Placement = { mw: inviteW, mcx: vw * 0.5, mcy: below(inviteW, 440) };
  const mix = (a: Placement, b: Placement, t: number): Placement => ({
    mw: lerp(a.mw, b.mw, t),
    mcx: lerp(a.mcx, b.mcx, t),
    mcy: lerp(a.mcy, b.mcy, t),
  });

  if (q <= 0.16) return mix(arrive, ambient, easeInOut(clamp01(q / 0.16)));
  if (q >= 0.82) return mix(ambient, invite, easeInOut(clamp01((q - 0.82) / 0.18)));
  return ambient;
}

/**
 * How far the machine recedes into the page while the questions are read: 0 at the
 * bookends (the machine is the shot), up to WASH_MAX through the middle (the machine
 * is the backdrop and the text owns the frame). Painted as a page-colour veil over
 * the drawn frame, plus a stronger left-side scrim under the text column.
 */
const WASH_MAX = 0.5;
function washFor(q: number): number {
  if (q <= 0.08) return 0;
  if (q < 0.2) return WASH_MAX * easeInOut((q - 0.08) / 0.12);
  if (q <= 0.78) return WASH_MAX;
  if (q < 0.93) return WASH_MAX * (1 - easeInOut((q - 0.78) / 0.15));
  return 0;
}

export function FilmStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  // null until mounted, so the server and the first client render agree.
  const [wide, setWide] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (wide === null) return;
    // Narrow viewports render the beat stills in CSS and this island stays idle. No
    // frame is fetched here, which is the whole point of the split.
    if (!wide) {
      markReady();
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const beats = filmBeats
      .map((b) => ({ ...b, el: document.getElementById(b.id) }))
      .filter((b): b is (typeof filmBeats)[number] & { el: HTMLElement } => !!b.el);

    if (process.env.NODE_ENV !== "production") {
      if (beats.length !== filmBeats.length) {
        console.warn(
          `FilmStage: ${filmBeats.length - beats.length} beat section(s) missing from the DOM.`,
        );
      }
      for (let i = 1; i < filmBeats.length; i++) {
        if (filmBeats[i].open <= filmBeats[i - 1].open) {
          throw new Error(
            `FilmStage: beat "${filmBeats[i].id}" opens at ${filmBeats[i].open} after ` +
              `"${filmBeats[i - 1].id}" at ${filmBeats[i - 1].open}. The lid must only ever open.`,
          );
        }
      }
    }

    // Reduced motion gets one frame, fully open, and no sequence at all.
    const frames: (HTMLImageElement | undefined)[] = [];
    const needed = reduced ? [FRAME_COUNT] : Array.from({ length: FRAME_COUNT }, (_, i) => i + 1);
    let firstPainted = false;

    for (const n of needed) {
      const img = new Image();
      img.decoding = "async";
      img.src = desktopFrameSrc(n);
      frames[n - 1] = img;
      // Decode off the scroll thread so drawImage only ever blits.
      img
        .decode()
        .then(() => {
          if (!firstPainted) draw();
        })
        .catch(() => {
          /* a frame that fails to decode is skipped by nearestReady */
        });
    }

    /** Nearest decoded frame to `i`, so a loading gap never blanks the stage. */
    const nearestReady = (i: number) => {
      for (let d = 0; d < FRAME_COUNT; d++) {
        const a = frames[i - d];
        if (a?.complete && a.naturalWidth) return a;
        const b = frames[i + d];
        if (b?.complete && b.naturalWidth) return b;
      }
      return undefined;
    };

    /** Lid openness and film progress, read off the beat anchors. */
    const progress = () => {
      if (reduced || beats.length < 2) return { open: 1, q: 1 };
      const y = window.scrollY;
      const vh = window.innerHeight;
      const anchors = beats.map((b) => b.el.getBoundingClientRect().top + y - vh * ANCHOR);
      // The first beat's anchor is its own top (usually 0), not top - ANCHOR*vh:
      // otherwise the film starts 55% pre-advanced before anyone has scrolled.
      anchors[0] = beats[0].el.getBoundingClientRect().top + y;
      const last = beats.length - 1;

      if (y <= anchors[0]) return { open: beats[0].open, q: 0 };
      if (y >= anchors[last]) return { open: beats[last].open, q: 1 };

      for (let i = 0; i < last; i++) {
        if (y >= anchors[i] && y < anchors[i + 1]) {
          const span = anchors[i + 1] - anchors[i];
          const t = span > 0 ? (y - anchors[i]) / span : 0;
          return { open: lerp(beats[i].open, beats[i + 1].open, t), q: (i + t) / last };
        }
      }
      return { open: beats[last].open, q: 1 };
    };

    const sizeCanvas = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * d);
      canvas.height = Math.round(canvas.clientHeight * d);
      return d;
    };
    let dpr = sizeCanvas();

    /** Screen-space rect of the glass for frame n, from the measured table.
     *  Returns null while the lid is too shut to show any glass. */
    const glassRect = (dx: number, dy: number, dw: number, dh: number, n: number) => {
      const g = GLASS_TABLE[String(n)];
      if (!g) return null;
      return {
        left: dx + g.x0 * dw,
        top: dy + g.y0 * dh,
        width: (g.x1 - g.x0) * dw,
        height: (g.y1 - g.y0) * dh,
      };
    };

    const draw = () => {
      const { open, q } = progress();
      const vw = canvas.clientWidth;
      const vh = canvas.clientHeight;
      const { mw, mcx, mcy } = placement(q, vw, vh);

      const scale = mw / MACHINE.w;
      const dw = FRAME_W * scale;
      const dh = FRAME_H * scale;
      const dx = mcx - dw * (MACHINE.cx / FRAME_W);
      const dy = mcy - dh * (MACHINE.cy / FRAME_H);

      const frameIdx = Math.round(open * (FRAME_COUNT - 1));
      const img = nearestReady(frameIdx);
      if (!img) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Flat page colour. The frames have their studio vignette divided out at build
      // time (build-frames.sh), so their field IS this colour and the baked edge
      // feather dissolves into it with nothing to reconcile.
      ctx.fillStyle = "#f2f1ed";
      ctx.fillRect(0, 0, vw, vh);

      ctx.drawImage(img, dx, dy, dw, dh);

      // Recede the machine into the page while the questions are read. Two layers:
      // a uniform page-colour veil, and a left-side scrim under the text column so
      // body copy always sits on near-page ground no matter how the machine and the
      // viewport happen to intersect. Both vanish at the bookends.
      const wash = washFor(q);
      if (wash > 0.005) {
        ctx.fillStyle = `rgba(242,241,237,${wash})`;
        ctx.fillRect(0, 0, vw, vh);
        const scrim = ctx.createLinearGradient(0, 0, vw * 0.62, 0);
        scrim.addColorStop(0, `rgba(242,241,237,${Math.min(1, wash * 1.7)})`);
        scrim.addColorStop(0.75, `rgba(242,241,237,${wash * 0.7})`);
        scrim.addColorStop(1, "rgba(242,241,237,0)");
        ctx.fillStyle = scrim;
        ctx.fillRect(0, 0, vw * 0.62, vh);
      }

      // The screen fills up as the doubts resolve: one hairline per beat answered.
      // Deliberately abstract — the readable copy is the section beside it, and an
      // abstract mark forgives the small error in the foreshortening approximation.
      const g = glassRect(dx, dy, dw, dh, frameIdx + 1);
      if (g && g.height > 24 && wash < 0.3) {
        ctx.save();
        ctx.globalAlpha = 1 - wash / 0.3;
        const answered = filmBeats.filter((b) => b.glass && b.open <= open + 0.001).length;
        ctx.beginPath();
        ctx.rect(g.left, g.top, g.width, g.height);
        ctx.clip();
        const glow = ctx.createLinearGradient(0, g.top, 0, g.top + g.height);
        glow.addColorStop(0, "rgba(255,97,26,0.08)");
        glow.addColorStop(1, "rgba(255,97,26,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(g.left, g.top, g.width, g.height);
        const padX = g.width * 0.13;
        const step = g.height * 0.1;
        for (let i = 0; i < answered; i++) {
          const y = g.top + g.height * 0.3 + i * step;
          if (y > g.top + g.height - step * 0.5) break;
          const latest = i === answered - 1;
          ctx.fillStyle = latest ? "rgba(255,140,80,0.85)" : "rgba(255,255,255,0.34)";
          ctx.fillRect(g.left + padX, y, g.width * (latest ? 0.5 : 0.74) - padX, 1.5);
        }
        ctx.restore();
      }

      // Position the glass overlay from the same transform, so the invitation sits
      // inside the screen at any viewport. It is decorative: the real, indexable
      // invitation is the CTA section this beat belongs to.
      const el = glassRef.current;
      if (el && g) {
        const on = open > 0.93;
        el.style.opacity = on ? String(clamp01((open - 0.93) / 0.05)) : "0";
        el.style.visibility = on ? "visible" : "hidden";
        el.style.left = `${g.left}px`;
        el.style.top = `${g.top}px`;
        el.style.width = `${g.width}px`;
        el.style.height = `${g.height}px`;
        el.style.fontSize = `${Math.max(13, g.width * 0.052)}px`;
      }

      if (!firstPainted) {
        firstPainted = true;
        markReady();
      }
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    const onResize = () => {
      dpr = sizeCanvas();
      onScroll();
    };

    // Dev contract: ?jump=<0..1> lands pre-scrolled through the film with scroll state
    // settled, so a screenshot harness can address any beat without scrolling to it.
    const jump = new URLSearchParams(window.location.search).get("jump");
    if (jump !== null) {
      const f = clamp01(parseFloat(jump) || 0);
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        window.scrollTo({ top: (doc.scrollHeight - window.innerHeight) * f, behavior: "auto" });
        requestAnimationFrame(draw);
      });
    }

    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [wide]);

  return (
    // An absolute wrapper spanning the whole film container, with a sticky child.
    // NOT the sticky + negative-margin pattern: a -mb-[100svh] collapses the sticky
    // element's margin box to zero height, which defeats the bottom constraint and
    // lets the stage ride under the footer — that shipped once. The absolute wrapper
    // takes no flow space, and the sticky child is correctly bounded by it, so the
    // machine slides away with the last beat. -z-10 keeps the canvas above the body
    // background but under all in-flow content, the transparent footer included.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
    >
      <div className="sticky top-0 h-[100svh]">
        <canvas ref={canvasRef} className="h-full w-full" />
        <div
          ref={glassRef}
          style={{ visibility: "hidden", opacity: 0 }}
          className="absolute flex flex-col items-center justify-center gap-[0.6em] px-[6%] text-center transition-opacity duration-200"
        >
          <p className="font-mono text-[0.42em] uppercase tracking-[0.22em] text-white/60">
            Free counselling
          </p>
          <p className="font-display text-[0.9em] font-medium lowercase leading-[1.05] tracking-[-0.03em] text-white">
            tell us what you want to study.
          </p>
        </div>
      </div>
    </div>
  );
}
