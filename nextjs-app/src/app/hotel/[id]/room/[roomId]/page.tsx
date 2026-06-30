import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchHotelOffers, mapOfferToRoomDetails, getMockRoomDetails } from "@/lib/amadeus";
import RoomDetailsClient from "./RoomDetailsClient";

interface Props {
  params: Promise<{ id: string; roomId: string }>;
}

const VALID_ROOM_IDS = ["1", "2", "3", "4"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, roomId } = await params;
  if (!VALID_ROOM_IDS.includes(roomId)) notFound();
  try {
    const offers = await fetchHotelOffers(id);
    if (offers.length > 0) {
      const room = mapOfferToRoomDetails(offers[0]);
      return { title: `${room.name} — LuminaStay`, description: room.description };
    }
  } catch (e) { if (process.env.ENABLE_AMADEUS === "true") console.error("Amadeus API error:", e); }
  const mock = getMockRoomDetails(id, roomId);
  return { title: `${mock.name} — LuminaStay`, description: mock.description };
}

export default async function RoomDetailsPage({ params }: Props) {
  const { id, roomId } = await params;
  if (!VALID_ROOM_IDS.includes(roomId)) notFound();

  let roomDetails = getMockRoomDetails(id, roomId);

  try {
    const offers = await fetchHotelOffers(id);
    const offer = offers.find((o) => o.id === roomId) || offers[0];
    if (offer) {
      roomDetails = mapOfferToRoomDetails(offer);
    }
  } catch (e) { if (process.env.ENABLE_AMADEUS === "true") console.error("Amadeus API error:", e); }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: roomDetails.name,
    description: roomDetails.description,
    bed: {
      "@type": "BedDetails",
      numberOfBeds: roomDetails.bedCount,
      typeOfBed: roomDetails.bedType,
    },
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: roomDetails.maxGuests,
    },
    offers: {
      "@type": "Offer",
      price: roomDetails.pricePerNight,
      priceCurrency: roomDetails.currency,
      availability: roomDetails.availableRooms > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    },
    amenityFeature: roomDetails.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RoomDetailsClient room={roomDetails} error={null} hotelId={id} />
    </>
  );
}
