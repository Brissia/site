import { notFound } from "next/navigation";

/** Any address that is not a page ends here, so the 404 keeps the header, the footer and the reader's language. */
export default function CatchAll() {
  notFound();
}
