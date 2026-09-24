"use client";

import { useState } from "react";

import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface CalendlyEmbedProps {
  /** The scheduling link, e.g. https://calendly.com/<account>/<event>. */
  url: string;
  className?: string;
}

/**
 * Calendly's inline embed as a plain iframe — no widget script, no
 * dependency. Calendly reads the frame's `embed_type=Inline` and colour
 * parameters from the URL, so the page can theme it without loading
 * anything of theirs.
 *
 * The colours are read from the live tokens on `<html>` rather than
 * duplicated here, so a token change re-themes the frame with no second
 * source of truth. They are re-read when the theme flips, which reloads the
 * frame: a rare action, and a frame in the wrong theme is worse.
 *
 * Renders the reserved-size surface alone until mounted, for the same
 * reason `ThemeToggle` does — the server cannot know the theme, and a frame
 * requested in the wrong colours would flash and reload on hydration. The
 * same surface stays behind the frame until it has loaded, so the page holds
 * its shape instead of showing a hole.
 */
export function CalendlyEmbed({ url, className }: CalendlyEmbedProps) {
  const { theme } = useTheme();
  const [loaded, setLoaded] = useState(false);

  // Recomputed on every render, and a theme flip is a render (useTheme
  // observes the class on <html>), so the tokens are re-read then and the
  // changed `key` below reloads the frame in the new colours.
  const src = theme === null ? null : embedUrl(url);

  return (
    <div
      className={cn(
        "relative h-[720px] overflow-hidden rounded-md border border-line bg-raised md:h-[780px]",
        className,
      )}
    >
      {!loaded && (
        <div aria-hidden="true" className="absolute inset-0 p-6 md:p-8">
          <span className="block h-5 w-1/3 rounded-sm bg-inset motion-safe:animate-pulse" />
          <span className="mt-4 block h-8 w-2/3 rounded-sm bg-inset motion-safe:animate-pulse" />
          <span className="mt-8 block h-64 w-full rounded-sm bg-inset motion-safe:animate-pulse" />
        </div>
      )}

      {src && (
        <iframe
          key={src}
          src={src}
          title="Pick a time for the call"
          onLoad={() => setLoaded(true)}
          className="relative h-full w-full border-0"
        />
      )}
    </div>
  );
}

/** A token's hex, without the `#` Calendly's parameters refuse. */
function token(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
    .replace(/^#/, "");
}

function embedUrl(url: string): string {
  const params = new URLSearchParams({
    embed_type: "Inline",
    embed_domain: window.location.hostname,
    hide_gdpr_banner: "1",
    background_color: token("--raised"),
    text_color: token("--fg"),
    primary_color: token("--accent"),
  });
  return `${url}${url.includes("?") ? "&" : "?"}${params.toString()}`;
}
