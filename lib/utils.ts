type ClassValue = string | number | null | undefined | false | ClassValue[];

/**
 * Joins Tailwind class names, dropping falsy values so conditionals read
 * inline: cn('px-4', isActive && 'text-cyan').
 *
 * Deliberately dependency-free (CLAUDE.md §10). Note it does NOT resolve
 * conflicting utilities — `cn('px-4', 'px-6')` yields both, and the last
 * one in the stylesheet wins rather than the last one passed. Build variant
 * maps so their classes don't overlap. If a real conflict shows up once
 * primitives land, that is the moment to justify `tailwind-merge`.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }

  return out.join(" ");
}

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const UNITS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
  { unit: "year", seconds: 31_536_000 },
  { unit: "month", seconds: 2_592_000 },
  { unit: "week", seconds: 604_800 },
  { unit: "day", seconds: 86_400 },
  { unit: "hour", seconds: 3_600 },
  { unit: "minute", seconds: 60 },
];

/**
 * "3 days ago", "yesterday", "just now". The one relative-time formatter —
 * the shipped panel and the open-source cards both read it, so a commit and
 * a repo can never describe the same moment two different ways.
 *
 * Fixed locale on purpose: this runs on the server, where the locale would
 * otherwise be whatever the host happens to be set to. `now` defaults here
 * rather than in the component because a component must not read the clock
 * during render (react-hooks/purity); the parameter exists for tests.
 */
export function formatRelative(iso: string, now = Date.now()): string {
  const elapsed = Math.max(0, (now - Date.parse(iso)) / 1000);

  for (const { unit, seconds } of UNITS) {
    if (elapsed >= seconds) {
      return relativeTime.format(-Math.floor(elapsed / seconds), unit);
    }
  }

  return "just now";
}
