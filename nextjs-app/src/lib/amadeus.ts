import { AmadeusHotelOfferResponse, AmadeusOffer, RoomDetails } from "@/types";
import { getHotelImages } from "./hotelData";

let tokenCache: { access_token: string; expires: number } | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expires) return tokenCache.access_token;
  const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_API_KEY!,
      client_secret: process.env.AMADEUS_API_SECRET!,
    }),
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  tokenCache = { access_token: data.access_token, expires: Date.now() + data.expires_in * 900 };
  return data.access_token;
}

const amadeusEnabled = () => process.env.ENABLE_AMADEUS === "true" && process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET;

export async function fetchHotelOffers(hotelId: string): Promise<AmadeusOffer[]> {
  if (!amadeusEnabled()) return [];
  const token = await getToken();
  const res = await fetch(
    `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit exceeded. Try again later.");
    throw new Error(`API error: ${res.status} ${await res.text()}`);
  }
  const data: AmadeusHotelOfferResponse = await res.json();
  return data.data || [];
}

export async function fetchOfferById(offerId: string): Promise<AmadeusOffer | null> {
  const token = await getToken();
  const res = await fetch(
    `https://test.api.amadeus.com/v3/shopping/hotel-offers/${offerId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}

export function mapOfferToRoomDetails(offer: AmadeusOffer, amenities: string[] = []): RoomDetails {
  const checkIn = new Date(offer.checkInDate);
  const checkOut = new Date(offer.checkOutDate);
  const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000));
  const base = parseFloat(offer.price.base);
  const total = parseFloat(offer.price.total);
  const taxes = (offer.price.taxes || []).map((t) => ({
    amount: parseFloat(t.amount),
    included: t.included,
  }));

  const freeCancel = offer.policies?.cancellations?.some((c) => c.type === "FULL_CANCELLATION" || c.amount === "0") ?? false;
  const cancelDeadline = offer.policies?.cancellations?.[0]?.deadline;

  return {
    id: offer.id,
    name: offer.room.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    type: offer.room.typeEstimated?.category || offer.room.type,
    bedType: (offer.room.typeEstimated?.bedType || "QUEEN").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    bedCount: offer.room.typeEstimated?.beds || 1,
    maxGuests: offer.guests.adults + (offer.guests.childAges?.length || 0),
    description: offer.room.description?.text || "Experience premium comfort in this thoughtfully designed room.",
    pricePerNight: nights > 0 ? Math.round(base / nights) : base,
    currency: offer.price.currency,
    totalPrice: total,
    taxes,
    checkIn: offer.checkInDate,
    checkOut: offer.checkOutDate,
    nights,
    availableRooms: 3,
    breakfast: offer.rateCode === "BAR",
    freeCancellation: freeCancel,
    cancellationDeadline: cancelDeadline,
    amenities,
    images: [],
  };
}

export const AMENITIES_LIST = [
  { id: "wifi", label: "Free Wi-Fi", icon: "Wifi" },
  { id: "ac", label: "Air Conditioning", icon: "Wind" },
  { id: "tv", label: "Flat-screen TV", icon: "Tv" },
  { id: "balcony", label: "Private Balcony", icon: "TreePine" },
  { id: "minibar", label: "Mini Bar", icon: "Wine" },
  { id: "coffee", label: "Coffee Maker", icon: "Coffee" },
  { id: "safe", label: "Safe Locker", icon: "Shield" },
  { id: "hairdryer", label: "Hair Dryer", icon: "Wind" },
  { id: "service", label: "Room Service", icon: "Bell" },
  { id: "workspace", label: "Work Desk", icon: "Pen" },
];

export function getMockRoomDetails(id: string, roomId: string): RoomDetails {
  const rooms: Record<string, RoomDetails> = {
    "1": {
      id: roomId,
      name: "Deluxe King Room",
      type: "DELUXE",
      bedType: "King",
      bedCount: 1,
      maxGuests: 2,
      description: "Experience ultimate comfort in our Deluxe King Room. Featuring a premium king-sized bed with Egyptian cotton linens, a marble bathroom with rain shower, and stunning city views through floor-to-ceiling windows.",
      pricePerNight: 389,
      currency: "USD",
      totalPrice: 778,
      taxes: [{ amount: 62.24, included: false }],
      checkIn: "2026-07-15",
      checkOut: "2026-07-17",
      nights: 2,
      availableRooms: 3,
      breakfast: true,
      freeCancellation: true,
      cancellationDeadline: "2026-07-10T23:59:00",
      amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Mini Bar", "Coffee Maker", "Safe Locker", "Hair Dryer", "Room Service", "Work Desk"],
      images: getHotelImages(parseInt(id)),
    },
    "2": {
      id: roomId,
      name: "Executive Suite",
      type: "SUITE",
      bedType: "King",
      bedCount: 1,
      maxGuests: 3,
      description: "Our Executive Suite offers a spacious living area separate from the bedroom, a private workspace, and access to the executive lounge with complimentary refreshments throughout the day.",
      pricePerNight: 512,
      currency: "USD",
      totalPrice: 1024,
      taxes: [{ amount: 81.92, included: false }],
      checkIn: "2026-07-15",
      checkOut: "2026-07-17",
      nights: 2,
      availableRooms: 2,
      breakfast: true,
      freeCancellation: true,
      cancellationDeadline: "2026-07-11T23:59:00",
      amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Balcony", "Mini Bar", "Coffee Maker", "Safe Locker", "Hair Dryer", "Room Service", "Work Desk"],
      images: getHotelImages(parseInt(id)),
    },
    "3": {
      id: roomId,
      name: "Junior Suite",
      type: "JUNIOR_SUITE",
      bedType: "Queen",
      bedCount: 1,
      maxGuests: 2,
      description: "A perfect blend of comfort and style. The Junior Suite features a queen-sized bed, a cozy sitting area, a walk-in closet, and upgraded bathroom amenities for a truly relaxing stay.",
      pricePerNight: 445,
      currency: "USD",
      totalPrice: 890,
      taxes: [{ amount: 71.2, included: false }],
      checkIn: "2026-07-15",
      checkOut: "2026-07-17",
      nights: 2,
      availableRooms: 4,
      breakfast: false,
      freeCancellation: true,
      cancellationDeadline: "2026-07-09T23:59:00",
      amenities: ["Free Wi-Fi", "Air Conditioning", "TV", "Mini Bar", "Coffee Maker", "Safe Locker", "Hair Dryer", "Work Desk"],
      images: getHotelImages(parseInt(id)),
    },
    "4": {
      id: roomId,
      name: "Standard Twin Room",
      type: "STANDARD",
      bedType: "Twin",
      bedCount: 2,
      maxGuests: 2,
      description: "Ideal for friends or colleagues traveling together. The Standard Twin Room offers two comfortable single beds, a work desk, and all essential amenities for a pleasant stay.",
      pricePerNight: 179,
      currency: "USD",
      totalPrice: 358,
      taxes: [{ amount: 28.64, included: false }],
      checkIn: "2026-07-15",
      checkOut: "2026-07-17",
      nights: 2,
      availableRooms: 6,
      breakfast: false,
      freeCancellation: true,
      cancellationDeadline: "2026-07-12T23:59:00",
      amenities: ["Free Wi-Fi", "Air Conditioning", "TV", "Work Desk", "Hair Dryer"],
      images: getHotelImages(parseInt(id)),
    },
  };
  return rooms[roomId] || rooms["1"];
}

export const HOUSE_RULES = [
  { label: "Check-in", value: "3:00 PM - 12:00 AM (Midnight)", icon: "LogIn" },
  { label: "Check-out", value: "11:00 AM - 12:00 PM (Noon)", icon: "LogOut" },
  { label: "Smoking", value: "Smoking is not allowed inside the rooms", icon: "Ban" },
  { label: "Pets", value: "Pets are not allowed", icon: "PawPrint" },
  { label: "Children", value: "All ages welcome. Extra bed available on request", icon: "Baby" },
];
