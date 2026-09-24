"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { Modal } from "@/components/ui/Modal";

interface ProjectModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * The routing half of the intercepted case study (§6.2). `Modal` owns focus,
 * scroll lock, Escape and the backdrop; this owns the one decision the
 * primitive refuses to make — what closing means. Here it means going back
 * to the page the visitor opened it from.
 *
 * Closing is two steps on purpose: `onClose` only flips `open`, so the exit
 * animation runs, and `router.back()` fires from `onExitComplete` once the
 * panel is gone. Calling `router.back()` directly would unmount the slot on
 * the same tick and cut the exit.
 *
 * `children` is server-rendered: the case-study body is a server component
 * passed through from the intercepting page, so lib/content never reaches
 * the client bundle.
 */
export function ProjectModal({ title, description, children }: ProjectModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const close = useCallback(() => setOpen(false), []);
  const back = useCallback(() => router.back(), [router]);

  return (
    <Modal
      open={open}
      onClose={close}
      onExitComplete={back}
      title={title}
      description={description}
      className="md:w-[min(48rem,calc(100%-5rem))]"
    >
      {children}
    </Modal>
  );
}
