import Image from "next/image";
import { Link } from "@/components/link";

export interface PlaceCardData {
  slug: string;
  city: string;
  country: string;
  /** The one sentence the place left behind. */
  notes: string;
  url: string;
  /** First photograph, when there is one. Always shown in black and white. */
  photo?: string;
  /** Already formatted, e.g. "OCT 2026". */
  dateLabel?: string;
}

/**
 * A stop on the road: a photograph, a sentence and a date.
 * Without a photograph the sentence carries the card, as essays do without a cover.
 */
export function PlaceCard({ place, sizes = "(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" }: { place: PlaceCardData; sizes?: string }) {
  return (
    <Link href={place.url} className="group block">
      {place.photo && (
        <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-card">
          <Image
            src={place.photo}
            alt=""
            fill
            sizes={sizes}
            className="object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className={place.photo ? "" : "border-t border-border pt-5"}>
        <p className="meta flex flex-wrap gap-x-2">
          <span>
            {place.city}, {place.country}
          </span>
          {place.dateLabel && (
            <>
              <span aria-hidden>·</span>
              <span>{place.dateLabel}</span>
            </>
          )}
        </p>
        <p className="mt-3 font-display text-[1.75rem] italic leading-[1.15] tracking-tight">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px]">
            &ldquo;{place.notes}&rdquo;
          </span>
        </p>
      </div>
    </Link>
  );
}
