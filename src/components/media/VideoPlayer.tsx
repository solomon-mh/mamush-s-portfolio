"use client";

import { Play } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { VideoContent } from "@/content/types";
import { parseVideoUrl } from "@/lib/video";
import { cx } from "@/lib/utils";

// Only one video plays at a time across the page.
const listeners = new Set<(activeId: string) => void>();
function announcePlaying(id: string) {
  for (const listener of listeners) listener(id);
}

export interface VideoPlayerProps {
  /** Title, YouTube/Vimeo `url` or local `file`, optional duration, captions and transcript. */
  video: Pick<VideoContent, "title" | "url" | "file" | "duration" | "captions" | "transcript">;
  /** Poster rendered on the server (an optimised image). */
  poster: ReactNode;
  /** Aspect ratio of the frame. Films default to 16:9. */
  aspectRatio?: number;
  tone?: "paper" | "night";
  className?: string;
}

/**
 * Click-to-load video. Nothing is downloaded until the visitor presses play:
 * the poster shows first, then a privacy-enhanced YouTube/Vimeo embed or a
 * native <video> with controls and captions. Never autoplays with sound.
 */
export function VideoPlayer({ video, poster, aspectRatio = 16 / 9, tone = "paper", className }: VideoPlayerProps) {
  const { title, url, file: fileUrl, captions: captionsUrl, duration, transcript } = video;
  const id = useId();
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const embed = url ? parseVideoUrl(url) : null;
  const playable = Boolean(embed || fileUrl);

  useEffect(() => {
    const listener = (activeId: string) => {
      if (activeId === id) return;
      videoRef.current?.pause();
      // Unmount other embeds so their audio stops.
      if (embed) setActive(false);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [id, embed]);

  useEffect(() => {
    if (!active) return;
    // Move focus into the player so keyboard users can operate it immediately.
    const target = frameRef.current?.querySelector<HTMLElement>("iframe, video");
    target?.focus();
  }, [active]);

  function play() {
    setActive(true);
    announcePlaying(id);
  }

  return (
    <figure className={className}>
      <div ref={frameRef} className="relative w-full overflow-hidden bg-ink" style={{ aspectRatio }}>
        {active && embed ? (
          <iframe
            src={embed.embedUrl}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : active && fileUrl ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full bg-ink"
            controls
            autoPlay
            playsInline
            preload="metadata"
            aria-label={title}
            onPlay={() => announcePlaying(id)}
          >
            <source src={fileUrl} />
            {captionsUrl && <track kind="captions" src={captionsUrl} srcLang="en" label="Captions" default />}
          </video>
        ) : (
          <>
            <div className="absolute inset-0 [&>div]:h-full">{poster}</div>
            {playable ? (
              <button
                type="button"
                onClick={play}
                aria-label={`Play video: ${title}${duration ? `, ${duration}` : ""}`}
                className="group absolute inset-0 flex items-end p-4 text-left text-paper sm:p-6"
              >
                <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0" aria-hidden="true" />
                <span className="relative inline-flex items-center gap-3">
                  <span className="flex size-14 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-300 ease-gallery group-hover:scale-105 sm:size-16">
                    <Play aria-hidden="true" className="size-5 translate-x-px fill-current" />
                  </span>
                  <span className="text-label sm:text-body" aria-hidden="true">
                    {title}
                    {duration ? <span className="text-paper/80"> ({duration})</span> : null}
                  </span>
                </span>
              </button>
            ) : (
              <p className="absolute inset-x-0 bottom-0 bg-ink/70 p-3 text-label text-paper">This video is unavailable.</p>
            )}
          </>
        )}
      </div>
      {transcript && (
        <details className={cx("mt-3 max-w-prose text-label", tone === "night" ? "text-paper/80" : "text-graphite")}>
          <summary className="cursor-pointer py-2 underline underline-offset-4">Transcript</summary>
          <p className="mt-2 whitespace-pre-line">{transcript}</p>
        </details>
      )}
    </figure>
  );
}
