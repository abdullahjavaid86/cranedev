import Image from "next/image";
import { ArrowUpRight, Mail, Phone } from "lucide-react";

import { Card } from "@/components/ui/Card";
import type { TeamContact, TeamMember } from "@/lib/content";
import { cn } from "@/lib/utils";

/** The avatar renders at one size on every breakpoint. */
const AVATAR_SIZES = "72px";

interface TeamCardProps {
  member: TeamMember;
  className?: string;
}

/**
 * One person: avatar, name, designation, a line or two of what they have
 * shipped, the stack as a quiet sans line, and whichever contact channels
 * they chose to publish.
 *
 * The avatar is a photo when the content has one and a monogram when it
 * does not — real people are added before real photos are, and a card that
 * needs a photograph to exist would keep the person off the page. A monogram
 * is not a silhouette: it is the person's own initials, and it is replaced
 * by the photo in the same 72px circle with no other change to the card.
 *
 * The card is not a link, because the contact row holds the links. Each
 * channel is a real anchor with a 44px target; `mailto:` and `tel:` are the
 * right hrefs for email and phone, and the profile links open in a new tab
 * with the arrow that marks every external link on the site. lucide ships no
 * brand glyphs, so LinkedIn and GitHub are named in text.
 */
export function TeamCard({ member, className }: TeamCardProps) {
  const { photo, name, role, bio, stack, contact } = member;
  const channels = contactChannels(contact);

  return (
    <Card className={cn("flex h-full flex-col p-5 md:p-6", className)}>
      <div className="flex items-center gap-4">
        {photo ? (
          <div className="relative size-[72px] shrink-0 overflow-hidden rounded-full border border-line bg-inset">
            <Image
              src={photo}
              alt={`${name}, ${role}`}
              fill
              sizes={AVATAR_SIZES}
              className="object-cover"
            />
          </div>
        ) : (
          <span
            aria-hidden="true"
            className="flex size-[72px] shrink-0 items-center justify-center rounded-full border border-line bg-inset text-h3 font-semibold text-fg"
          >
            {initials(name)}
          </span>
        )}

        <div className="min-w-0">
          {/* h2 styled as h3: on /team the cards follow the page's h1. */}
          <h2 className="text-h3 leading-tight">{name}</h2>
          <p className="mt-1 text-small text-muted">{role}</p>
        </div>
      </div>

      <p className="mt-5 text-muted">{bio}</p>

      {stack.length > 0 && (
        <p className="mt-4 text-small text-muted">{stack.join(" · ")}</p>
      )}

      {channels.length > 0 && (
        <ul
          aria-label={`Contact ${name}`}
          className="mt-auto flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-4"
        >
          {channels.map((channel) => (
            <li key={channel.label}>
              <a
                href={channel.href}
                {...(channel.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="inline-flex min-h-11 items-center gap-1.5 text-small text-muted transition-colors duration-(--d-micro) hover:text-fg active:text-fg"
              >
                {channel.icon}
                <span className="break-all">{channel.text}</span>
                {channel.external && (
                  <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
                )}
                <span className="sr-only">{channel.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** "Amara Okafor" → "AO". One initial for a single-word name. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

interface Channel {
  label: string;
  text: string;
  href: string;
  external: boolean;
  icon?: React.ReactNode;
}

/**
 * The contact block in display order. Email and phone show the value itself,
 * because that is what a reader wants to copy; the profiles show the service
 * name, because a full profile URL is noise.
 */
function contactChannels(contact: TeamContact): Channel[] {
  const channels: Channel[] = [];
  if (contact.email) {
    channels.push({
      label: "Email",
      text: contact.email,
      href: `mailto:${contact.email}`,
      external: false,
      icon: <Mail aria-hidden="true" className="size-3.5 shrink-0" />,
    });
  }
  if (contact.phone) {
    channels.push({
      label: "Phone",
      text: contact.phone,
      href: `tel:${contact.phone.replace(/[^\d+]/g, "")}`,
      external: false,
      icon: <Phone aria-hidden="true" className="size-3.5 shrink-0" />,
    });
  }
  if (contact.linkedin) {
    channels.push({
      label: "LinkedIn profile",
      text: "LinkedIn",
      href: contact.linkedin,
      external: true,
    });
  }
  if (contact.github) {
    channels.push({
      label: "GitHub profile",
      text: "GitHub",
      href: contact.github,
      external: true,
    });
  }
  if (contact.website) {
    channels.push({
      label: "Website",
      text: "Website",
      href: contact.website,
      external: true,
    });
  }
  return channels;
}
