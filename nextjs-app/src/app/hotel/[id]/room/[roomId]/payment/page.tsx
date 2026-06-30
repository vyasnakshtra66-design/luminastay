import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMockRoomDetails } from "@/lib/amadeus";
import { getAllHotels } from "@/lib/hotelData";
import ErrorBoundary from "@/components/ErrorBoundary";
import PaymentPageClient from "./PaymentPageClient";

interface Props { params: Promise<{ id: string; roomId: string }> }

const VALID_ROOM_IDS = ["1", "2", "3", "4"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, roomId } = await params;
  if (!VALID_ROOM_IDS.includes(roomId)) notFound();
  const room = getMockRoomDetails(id, roomId);
  return { title: `Payment — ${room.name} — LuminaStay` };
}

export default async function PaymentPage({ params }: Props) {
  const { id, roomId } = await params;
  if (!VALID_ROOM_IDS.includes(roomId)) notFound();

  const room = getMockRoomDetails(id, roomId);
  const hotels = getAllHotels();
  const hotel = hotels.find(h => h.id === parseInt(id)) || hotels[0];

  return (
    <ErrorBoundary>
      <PaymentPageClient hotel={hotel} room={room} />
    </ErrorBoundary>
  );
}
