"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * A short, silent animation preview for the homepage hero.
 * - Always muted, never has sound.
 * - Doesn't autoplay for visitors who prefer reduced motion.
 * - Always offers a pause control (WCAG 2.2.2).
 */
export function HeroLoop({
  src,
  poster,
  width,
  height,
  label,
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    }
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      void video.play().then(() => setPlaying(true));
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <div className="relative">
      <video
        ref={ref}
        className="block h-auto w-full bg-paper-deep"
        style={{ aspectRatio: `${width} / ${height}` }}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      >
        <source src={src} />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-3 right-3 inline-flex size-11 items-center justify-center rounded-full bg-paper/90 text-ink hover:bg-paper"
      >
        {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
        <span className="sr-only">{playing ? "Pause animation" : "Play animation"}</span>
      </button>
    </div>
  );
}
