/**
 * Closes the modal on a client-side navigation to any other route.
 *
 * Parallel slots keep their last active page across soft navigations even
 * when the new URL does not match them, so a visitor who opens a case study
 * and then clicks "About" in the header would otherwise arrive at /about with
 * the modal still open. Matching every path with a page that renders nothing
 * is the documented fix.
 */
export default function ModalCatchAll() {
  return null;
}
