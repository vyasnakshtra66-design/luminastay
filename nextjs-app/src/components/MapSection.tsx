"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapHotel {
  id: number;
  name: string;
  lat: number;
  lng: number;
  price: number;
}

interface MapSectionProps {
  hotels: MapHotel[];
}

export default function MapSection({ hotels }: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const center: [number, number] =
      hotels.length > 0
        ? [hotels[0].lat, hotels[0].lng]
        : [25.2048, 55.2708];

    const map = L.map(mapRef.current, {
      center,
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const icon = L.divIcon({
      html: '<div style="background:#111;color:#fff;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2);border:2px solid #fff">$<span></span></div>',
      className: "",
      iconSize: [0, 0],
      iconAnchor: [20, 20],
    });

    hotels.forEach((h) => {
      const marker = L.marker([h.lat, h.lng], { icon });
      marker.bindTooltip(`<b>${h.name}</b><br/>$${h.price}/night`, {
        direction: "top",
        offset: [0, -8],
      });
      marker.addTo(map);
    });

    if (hotels.length > 1) {
      const bounds = L.latLngBounds(hotels.map((h) => [h.lat, h.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [hotels]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-xl" style={{ minHeight: "300px" }} />
  );
}
