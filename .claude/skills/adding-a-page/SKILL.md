---
name: adding-a-page
description: Use when creating a new route or reworking an existing one in this repo — /about, /team, /contact, /schedule, /careers, /careers/[slug], /work, /work/[slug], legal pages, or a 404. Covers route layout, metadata, OG tags, nav registration, and the per-page-type recipes. Triggers on "new page", "add a route", "about us", "team page", "careers", "contact page", "schedule a meeting", "book a call", "project details", "case study", "not found".
---

# Adding a Page

Each route is a full deliverable: real copy, correct metadata, keyboard path, and a place in the nav. A route that exists but is not linked and has no OG tags is not shipped.

## Route map

| Route             | Purpose                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------- |
| `/`               | Home — hero, proof, services, work, testimonials, brands, process, open source, contact |
| `/work`           | All projects, filterable by stack or sector                                             |
| `/work/[slug]`    | Project detail / case study                                                             |
| `/team`           | The people, with real substance per person                                              |
| `/about`          | Who we are, how we work, why we exist                                                   |
| `/contact`        | Form + direct channels                                                                  |
| `/schedule`       | Book a call                                                                             |
| `/careers`        | Open roles + how we hire                                                                |
| `/careers/[slug]` | Role detail + application                                                               |
| `/not-found`      | Real 404 in the site's voice                                                            |

## Checklist for every new route

1. `app/<route>/page.tsx` — **default export**, server component, composes sections from `components/sections/`.
2. Export `metadata` (or `generateMetadata` for dynamic routes): title, description, `openGraph`, `twitter`. Title pattern: `<Page> — <Agency>`. Description is one specific sentence, not the tagline.
3. Add the route to the shared nav source so `Header` and `Footer` both pick it up. Active item gets the accent border — the one place an accent border is legal.
4. Reuse the section shell (`py-28 md:py-40`, `<Container>`). One `h1` on the page, headings ordered. Compose and check the page at 360px before looking at it wide.
5. Dynamic routes: `generateStaticParams()` from the typed content file, plus `notFound()` for an unknown slug.
   **`params` and `searchParams` are async in Next 15+/16 — you must `await` them.** This is the single most common way code written from memory breaks on this stack:

   ```tsx
   export default async function Page({
     params,
   }: {
     params: Promise<{ slug: string }>;
   }) {
     const { slug } = await params;
   }
   ```

   `cookies()` and `headers()` are async too, and awaiting any of them opts the segment into dynamic rendering. A page reading only typed content from `content/` should stay static — don't reach for them.

6. Every page ends with the same CTA band → footer. One accent element in that band.
7. Run [quality-gate](../quality-gate/SKILL.md), then update `MILESTONES.md`.

## Route state files

The three designed states from [data-and-forms](../data-and-forms/SKILL.md) have App Router file conventions. Co-locate them in the segment folder alongside `page.tsx` — do not hand-roll equivalents inside the page.

| File            | Role                                                                                |
| --------------- | ----------------------------------------------------------------------------------- |
| `loading.tsx`   | Route-level pending UI. Skeleton matching the final layout, never a spinner.        |
| `error.tsx`     | Error boundary. **Must be a client component** (`'use client'`), and takes `reset`. |
| `not-found.tsx` | Rendered by `notFound()`. The root one is the site 404.                             |

Wrap a slow or uncacheable part in its own `<Suspense>` so the static shell paints immediately and the rest of the route stays cacheable — the GitHub-fed sections are the case for this. A route group `(group)` organizes files without adding a URL segment; use it if the marketing routes need a shared layout that `/` does not.

## Shared chrome on mobile

Every route inherits these, so get them right once in `layout/`:

- **Header** — a full-width glass bar on phones; a floating glass panel inset from the top at `md` and up. It is one of the two glass surfaces allowed below `md`. Honours `env(safe-area-inset-top)`.
- **Nav overlay** — full-screen at `100dvh` (never `100vh`), links staggering in. It **locks body scroll, traps focus, closes on Escape and on route change**, and returns focus to the trigger. The trigger is an icon button with an `aria-label` and `aria-expanded`.
- **Footer** — single column on mobile, columns at `md`. Honours `env(safe-area-inset-bottom)`.
- **Scroll progress** — a 2px accent line fixed at the top of the viewport, on every route and every size. Do not build a per-page variant.

## Page recipes

**`/work` (Projects index)** — `<StaggerGroup />` over `content/work.json`. Filter chips for stack, driven by client-side state on a leaf component (`FilteredProjects`); filtering must not remount the grid. Chips are only the tags shared by at least two projects and not by all — a chip that narrows to one card, or to every card, is furniture. Fewer than 6 projects, no filter bar at all.

**`/work/[slug]` as a modal** — the `@modal` slot lives in `app/(site)/` beside the pages. Three files render `null` so the modal only shows when it should: `default.tsx` (hard navigation), `page.tsx` (client navigation to `/`) and `[...catchAll]/page.tsx` (client navigation anywhere else — slots keep their last page otherwise, so without this the modal follows the visitor to `/about`). `(.)work/[slug]/page.tsx` renders `ProjectModal` around the same `ProjectDetail` body the full page uses. Close is two steps: `onClose` flips `open` so the exit animates, and `router.back()` runs in `Modal`'s `onExitComplete`.

**`/work/[slug]` (Project details)** — the page a CTO reads before booking. Structure:
`problem → what we built → how → measurable outcome`. Hero with client name and one-line outcome carrying a real number; a quiet metadata row (stack, duration, team size, year) in Geist Sans, not mono; the narrative in `65ch` prose; at least one real artifact (architecture sketch, screenshot, or metric); a pull-quote from the client if one exists; next/previous project links. No generic "challenges and solutions" headings.

**`/team`** — grid of real people (see [building-a-section](../building-a-section/SKILL.md)). Then a short "how we work" block. Never pad the grid with placeholder members; a three-person agency reads as honest, a fake eight-person one does not survive one call.

**`/about`** — the origin, the operating principles, and what we decline to do. Saying what you don't take on is the most credible thing on this page. Prose in `65ch`, one masked headline max, no stock office photography.

**`/contact`** — form plus the direct channels (email, GitHub, location, timezone) as quiet sans text. Set expectations explicitly: "We reply within one business day." See [data-and-forms](../data-and-forms/SKILL.md).

**`/schedule`** — booking, via **Calendly** (decided 2026-09-24). `components/ui/CalendlyEmbed` is a plain iframe of the scheduling link with Calendly's `embed_type=Inline` and colour parameters — no widget script, no dependency, and the colours are read from the live tokens on `<html>` so a token change re-themes it. The link lives in `siteLinks.calendly` (`lib/nav.ts`); while it is `null` the page renders the direct-channels fallback. Always keep the plain "open it on Calendly" link under the frame for browsers that block third-party frames. The `h1` is the CTA's own label, so button, title and heading say the same words. No CTA band on this page — its one action is the page itself.

**`/careers`** — roles from `content/roles.json`. Each row: title, quiet metadata (level, location, comp band, stack). State the comp band; withholding it costs more senior applicants than it saves. Include how we hire, step by step, with real timings. If there are no open roles, say so and offer a way to be told when there are — never an empty list.

**`/careers/[slug]`** — the role in full: what you'd own, what the first 90 days look like, what we expect you to already know, the interview loop, the band. Application form with a résumé/portfolio link field (URL, not upload — there is no blob storage), submitting through a Server Action into the `applications` collection.

**`/not-found`** — in the interface's voice, with a route back and links to the two most useful pages. No apology, no ASCII art.

## Reject on sight

- A route with no `metadata` export or no OG tags.
- A page not reachable from `Header` or `Footer`.
- More than one `h1`, or a heading level skipped.
- A `#` href in shipped navigation.
- A dynamic route with no `notFound()` path.
- Legal or comp claims invented to fill space.

## Related

[building-a-section](../building-a-section/SKILL.md) · [data-and-forms](../data-and-forms/SKILL.md) · [content-and-copy](../content-and-copy/SKILL.md) · [quality-gate](../quality-gate/SKILL.md)
