import { ArrowLink } from "@/components/editorial";

export default function NotFound() {
  return (
    <div className="shell py-28 md:py-40">
      <p className="meta">404</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl leading-none tracking-tight md:text-7xl">This room does not exist yet.</h1>
      <ArrowLink href="/" className="mt-10">
        Back to the beginning
      </ArrowLink>
    </div>
  );
}
