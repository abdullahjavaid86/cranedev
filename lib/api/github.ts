import "server-only";

import { unstable_cache } from "next/cache";
import { z } from "zod";

import { openSource } from "@/lib/content";
import type { Commit, Repo } from "@/types";
import { api } from "./client";

/**
 * Typed GitHub reads (§7.2). Everything upstream is `unknown` until a zod
 * schema narrows it, and only our own types (types/index.ts) leave this
 * module — no raw GitHub object reaches a component.
 *
 * Failure is the normal case to design for, not the exception: rate limits,
 * outages, an owner that does not exist yet. Every read logs the real error
 * server-side and returns its typed fallback, so a visitor never sees an
 * error state for decorative data. With no `GITHUB_OWNER` configured nothing
 * is fetched at all, which is also what keeps `next build` off the network
 * in CI.
 *
 * Cached once per hour with `unstable_cache`, keyed by owner, so however
 * many consumers read the feed — the hero, the open-source section, the
 * route handler — GitHub sees at most four requests an hour: the repository
 * list, then the latest commits of the three most recently pushed
 * repositories. That is well inside the unauthenticated limit of sixty, so
 * the token is genuinely optional.
 *
 * Why commits come from repositories and not the events feed: the public
 * events API stopped carrying commit messages in push payloads — a
 * PushEvent now holds only `ref`, `head` and `before` — so the feed can say
 * that something was pushed but not what. Verified against the live API,
 * 2026-09-24.
 */

const API = "https://api.github.com";
const REVALIDATE = 3600;
const COMMIT_COUNT = 3;
const REPO_COUNT = 6;
/** How many recently pushed repositories to read commits from. */
const COMMIT_SOURCES = 3;
/** Commits fetched per repository — headroom for skipping merge commits. */
const COMMITS_PER_REPO = 5;

/** A login is letters, digits and hyphens. Anything else is not a URL segment. */
const OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;

const UpstreamRepoSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number().int(),
  /** Null on a repository that has never received a push. */
  pushed_at: z.string().nullable(),
  fork: z.boolean(),
  archived: z.boolean(),
});

const UpstreamCommitSchema = z.object({
  sha: z.string(),
  commit: z.object({
    message: z.string(),
    committer: z.object({ date: z.string() }).nullable(),
  }),
});

type UpstreamRepo = z.infer<typeof UpstreamRepoSchema>;

interface Feed {
  commits: Commit[] | null;
  repos: Repo[] | null;
}

function githubOwner(): string | null {
  const owner = process.env.GITHUB_OWNER?.trim() ?? "";
  if (!owner) return null;
  if (!OWNER.test(owner)) {
    console.error(`[github] GITHUB_OWNER "${owner}" is not a valid login; ignoring`);
    return null;
  }
  return owner;
}

function headers(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN?.trim();
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const res = await api.get<unknown>(`${API}${path}`, { headers: headers() });
  return schema.parse(res.data);
}

const pushedAt = (repo: UpstreamRepo) => Date.parse(repo.pushed_at ?? "") || 0;

/**
 * The owner's own public repositories — what they wrote, not what they
 * forked or retired. Works for a user and an organisation alike.
 */
async function fetchOwnRepos(owner: string): Promise<UpstreamRepo[]> {
  const repos = await get(
    `/users/${owner}/repos?type=owner&sort=pushed&per_page=100`,
    z.array(UpstreamRepoSchema),
  );
  return repos.filter((repo) => !repo.fork && !repo.archived);
}

/**
 * Most-starred first. The REST API has no notion of a profile's pinned
 * repositories (that is GraphQL, which needs a token unconditionally), so
 * this is the honest approximation.
 */
function featured(repos: UpstreamRepo[]): Repo[] {
  return [...repos]
    .sort(
      (a, b) => b.stargazers_count - a.stargazers_count || pushedAt(b) - pushedAt(a),
    )
    .slice(0, REPO_COUNT)
    .map((repo) => ({
      fullName: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
    }));
}

/**
 * The latest commits on the default branch of the most recently pushed
 * repositories, merged newest first. Merge commits are skipped: they record
 * that work landed, not what the work was.
 */
async function fetchRecentCommits(repos: UpstreamRepo[]): Promise<Commit[]> {
  const sources = [...repos]
    .sort((a, b) => pushedAt(b) - pushedAt(a))
    .slice(0, COMMIT_SOURCES);

  const lists = await Promise.all(
    sources.map((repo) =>
      get(
        `/repos/${repo.full_name}/commits?per_page=${COMMITS_PER_REPO}`,
        z.array(UpstreamCommitSchema),
      ).then((commits) =>
        commits.flatMap((commit): Commit[] => {
          const message = (commit.commit.message.split("\n")[0] ?? "").trim();
          const date = commit.commit.committer?.date;
          if (!message || !date || message.startsWith("Merge ")) return [];
          return [
            {
              sha: commit.sha.slice(0, 7),
              repo: repo.full_name,
              message,
              pushedAt: date,
            },
          ];
        }),
      ),
    ),
  );

  return lists
    .flat()
    .sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt))
    .slice(0, COMMIT_COUNT);
}

/**
 * One repository read feeds both halves; the commit read is settled on its
 * own so it failing does not blank the grid. A `null` half is cached like
 * any other value: an hour of fallback after a rate-limit response is the
 * right behaviour, not a bug.
 */
const loadFeed = unstable_cache(
  async (owner: string): Promise<Feed> => {
    let repos: UpstreamRepo[];
    try {
      repos = await fetchOwnRepos(owner);
    } catch (err) {
      console.error("[github] repositories unavailable, using content fallback:", err);
      return { commits: null, repos: null };
    }

    try {
      return { commits: await fetchRecentCommits(repos), repos: featured(repos) };
    } catch (err) {
      console.error("[github] commits unavailable, hiding the panel:", err);
      return { commits: null, repos: featured(repos) };
    }
  },
  ["github-feed"],
  { revalidate: REVALIDATE, tags: ["github"] },
);

async function feed(): Promise<Feed> {
  const owner = githubOwner();
  return owner ? loadFeed(owner) : { commits: null, repos: null };
}

/**
 * For the hero's "Recently shipped" panel. Empty when unconfigured or
 * unavailable — there is no fallback for commits on purpose, because
 * invented commits are the one thing this panel must never show (§4.5).
 */
export async function getRecentCommits(): Promise<Commit[]> {
  return (await feed()).commits ?? [];
}

export interface OpenSourceFeed {
  /** Where "all repositories" points. */
  profileUrl: string;
  repos: Repo[];
  source: "github" | "content";
}

/** For the open-source section. Falls back to content/opensource.json (§7.2). */
export async function getOpenSource(): Promise<OpenSourceFeed> {
  const owner = githubOwner();
  const repos = (await feed()).repos;

  if (owner && repos) {
    return { profileUrl: `https://github.com/${owner}`, repos, source: "github" };
  }
  return { ...openSource, source: "content" };
}
