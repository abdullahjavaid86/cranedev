import { NextResponse } from "next/server";

import { getOpenSource, getRecentCommits } from "@/lib/api/github";

/**
 * The narrowed GitHub read for anything that runs in the browser (§7.2).
 * The token stays on this side of the wire; the response carries only our
 * own types, already fallen back, so a client consumer never has to know
 * whether GitHub answered.
 *
 * Cached at the route: axios bypasses Next's fetch cache, so this is where
 * the hour lives for a client. The same hour is enforced underneath in
 * lib/api/github.ts, which is what the server-rendered sections read.
 *
 * Nothing on the client reads this today — the hero and the open-source
 * section render on the server. It exists so the next client consumer has
 * the sanctioned path instead of inventing one.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const [commits, openSource] = await Promise.all([
    getRecentCommits(),
    getOpenSource(),
  ]);

  return NextResponse.json({ commits, openSource });
}
