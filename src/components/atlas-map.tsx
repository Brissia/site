"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

export interface MapPlace {
  slug: string;
  city: string;
  country: string;
  coordinates: [number, number];
  notes: string;
  url: string;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Leaflet + OpenStreetMap: free, no API key, no vendor lock-in.
 * The library loads only when the map scrolls near the viewport.
 */
export default function AtlasMap({
  places,
  className = "h-[60vh] min-h-80",
  focus,
}: {
  places: MapPlace[];
  className?: string;
  /** Center on one place instead of fitting all of them. */
  focus?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const key = places.map((p) => p.slug).join(",");

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    const start = async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !container.current) return;

      const touch = window.matchMedia("(pointer: coarse)").matches;
      map = L.map(el, {
        scrollWheelZoom: false,
        // On phones one finger scrolls the page; the map never traps the reader.
        dragging: !touch,
        zoomControl: !touch,
        attributionControl: true,
        worldCopyJump: true,
        minZoom: 1,
      });

      map.attributionControl.setPrefix(false);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 12,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const ink = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "#111";
      const paper = getComputedStyle(document.documentElement).getPropertyValue("--background").trim() || "#fff";

      places.forEach((p) => {
        L.circleMarker(p.coordinates, {
          radius: 6,
          color: paper,
          weight: 2,
          fillColor: ink,
          fillOpacity: 1,
        })
          .addTo(map!)
          .bindPopup(
            `<a href="${p.url}" style="font-weight:500;text-decoration:underline;text-underline-offset:3px">${escapeHtml(
              `${p.city}, ${p.country}`,
            )}</a><br/><span style="opacity:.7">${escapeHtml(p.notes)}</span>`,
            { maxWidth: 240, closeButton: false },
          );
      });

      if (focus && places[0]) {
        map.setView(places[0].coordinates, 5);
      } else if (places.length > 1) {
        map.fitBounds(L.latLngBounds(places.map((p) => p.coordinates)), { padding: [40, 40], maxZoom: 5 });
      } else if (places[0]) {
        map.setView(places[0].coordinates, 4);
      } else {
        map.setView([-10, -60], 2);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          start();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, focus]);

  return (
    <div
      ref={container}
      role="region"
      aria-label={`Map of ${places.length} ${places.length === 1 ? "place" : "places"}`}
      className={`atlas-map isolate z-0 w-full border border-border bg-card ${className}`}
    />
  );
}
