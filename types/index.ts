/**
 * Shapes that cross from the data layer into components (§7.2). Every GitHub
 * response is mapped into one of these before it leaves lib/api/ — no raw
 * upstream object reaches JSX.
 *
 * Content-derived types stay where their zod schema lives
 * (lib/content/schemas.ts) so a type can never drift from the schema that
 * validates it. `Repo` is re-exported from there because the open-source
 * section's fallback is JSON content and its live feed must match it exactly.
 */

export type { Repo } from "@/lib/content/schemas";

/** One pushed commit, for the hero's "Recently shipped" panel. */
export interface Commit {
  /** Short sha, seven characters. The one place the mono face belongs. */
  sha: string;
  /** `owner/name`. */
  repo: string;
  /** First line of the commit message. */
  message: string;
  /** ISO timestamp of the push. Formatted at render, never here. */
  pushedAt: string;
}
