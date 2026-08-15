"use client";

import { useEffect, useRef } from "react";

// Full-bleed laptop backdrop, robust across hosts. The OPEN still is the always-on
// base layer, so the hero is guaranteed to render the open laptop (black screen) for
// the headline — no dependency on autoplay or HTTP range/seeking (Cloudflare Workers
// assets serve the mp4 without 206, which breaks paused-video seeking). On top, the
// closed→open clip plays ONCE and is revealed only once it is genuinely `playing`;
// if autoplay is blocked or the user prefers reduced motion, it stays hidden and the
// open still shows through. A non-looping video holds its last (open) frame at the end.
export function HeroStage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // still shows

    const reveal = () => {
      video.style.opacity = "1";
    };
    video.addEventListener("playing", reveal, { once: true });
    video.play?.().catch(() => {
      /* autoplay blocked → leave hidden, open still shows through */
    });

    return () => video.removeEventListener("playing", reveal);
  }, []);

  return (
    <>
      {/* base: open-state still — always visible, the reliable open look */}
      <img
        src="/render/laptop-open-poster.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_46%]"
      />
      {/* enhancement: closed→open clip, revealed only while actually playing */}
      <video
        ref={videoRef}
        data-hero-video
        src="/render/laptop-open-web.mp4"
        poster="/render/laptop-closed-poster.jpg"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_46%] opacity-0 transition-opacity duration-500"
      />
    </>
  );
}
