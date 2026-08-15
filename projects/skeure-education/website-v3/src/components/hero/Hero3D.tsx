"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Live WebGL scene is client-only + lazy: never SSR'd, only mounted once the hero
// scrolls into view AND motion is allowed. The static poster is the LCP element and
// the fallback for no-JS, reduced-motion, AND any device where WebGL fails.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// If WebGL can't initialise (no GPU / context lost / old device), swallow the error
// and keep the poster — the hero must never crash the page.
class WebGLBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface Hero3DProps {
  poster: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function Hero3D({ poster, alt, width, height, className }: Hero3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false); // canvas has drawn — safe to reveal
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // keep the poster, never spin up WebGL
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showCanvas = mount && !failed;
  const posterHidden = ready && !failed;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <Image
        src={poster}
        alt={alt}
        width={width}
        height={height}
        priority
        sizes="(max-width: 1024px) 88vw, 46vw"
        className={cn(
          "h-auto w-full transition-opacity duration-700 [filter:saturate(0.42)_contrast(1.03)] [mask-image:radial-gradient(74%_74%_at_56%_46%,black_54%,transparent_92%)]",
          posterHidden ? "opacity-0" : "opacity-100",
        )}
      />
      {showCanvas && (
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <WebGLBoundary onError={() => setFailed(true)}>
            <HeroScene onReady={() => setReady(true)} />
          </WebGLBoundary>
        </div>
      )}
    </div>
  );
}
