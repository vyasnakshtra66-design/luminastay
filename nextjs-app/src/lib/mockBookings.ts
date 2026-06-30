export interface BookingData {
  _id: string;
  bookingId: string;
  userId: string;
  hotelId: number;
  hotelName: string;
  hotelImage: string;
  hotelAddress: string;
  roomId: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPaid: number;
  currency: string;
  status: "upcoming" | "completed" | "cancelled";
  paymentStatus: "paid" | "refunded" | "pending";
  paymentId: string;
  createdAt: string;
  updatedAt: string;
  timeline: { label: string; date: string; completed: boolean }[];
}

const MOCK_BOOKINGS: BookingData[] = [
  {
    _id: "1",
    bookingId: "LUM829471",
    userId: "user_1",
    hotelId: 1,
    hotelName: "Grand Palace Hotel",
    hotelImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
    hotelAddress: "Dubai Marina, UAE",
    roomId: "1",
    roomType: "Deluxe King Room",
    checkIn: "2026-08-15",
    checkOut: "2026-08-18",
    nights: 3,
    guests: 2,
    totalPaid: 1167,
    currency: "USD",
    status: "upcoming",
    paymentStatus: "paid",
    paymentId: "pay_NX8wK9mR2vLp1A",
    createdAt: "2026-07-20T10:30:00Z",
    updatedAt: "2026-07-20T10:35:00Z",
    timeline: [
      { label: "Booking Created", date: "Jul 20, 2026", completed: true },
      { label: "Payment Completed", date: "Jul 20, 2026", completed: true },
      { label: "Booking Confirmed", date: "Jul 20, 2026", completed: true },
      { label: "Check-in", date: "Aug 15, 2026", completed: false },
      { label: "Check-out", date: "Aug 18, 2026", completed: false },
    ],
  },
  {
    _id: "2",
    bookingId: "LUM628903",
    userId: "user_1",
    hotelId: 3,
    hotelName: "The Ritz-Carlton",
    hotelImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80",
    hotelAddress: "Central Paris, France",
    roomId: "2",
    roomType: "Executive Suite",
    checkIn: "2026-09-05",
    checkOut: "2026-09-08",
    nights: 3,
    guests: 3,
    totalPaid: 1536,
    currency: "USD",
    status: "upcoming",
    paymentStatus: "paid",
    paymentId: "pay_MW7vJ8kL1xQp2B",
    createdAt: "2026-08-01T14:00:00Z",
    updatedAt: "2026-08-01T14:05:00Z",
    timeline: [
      { label: "Booking Created", date: "Aug 1, 2026", completed: true },
      { label: "Payment Completed", date: "Aug 1, 2026", completed: true },
      { label: "Booking Confirmed", date: "Aug 1, 2026", completed: true },
      { label: "Check-in", date: "Sep 5, 2026", completed: false },
      { label: "Check-out", date: "Sep 8, 2026", completed: false },
    ],
  },
  {
    _id: "3",
    bookingId: "LUM451782",
    userId: "user_1",
    hotelId: 5,
    hotelName: "Overwater Bungalow",
    hotelImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    hotelAddress: "North Malé Atoll, Maldives",
    roomId: "1",
    roomType: "Deluxe King Room",
    checkIn: "2026-06-10",
    checkOut: "2026-06-14",
    nights: 4,
    guests: 2,
    totalPaid: 1556,
    currency: "USD",
    status: "completed",
    paymentStatus: "paid",
    paymentId: "pay_KT5uH6jI9wRo3C",
    createdAt: "2026-05-15T09:00:00Z",
    updatedAt: "2026-06-14T11:00:00Z",
    timeline: [
      { label: "Booking Created", date: "May 15, 2026", completed: true },
      { label: "Payment Completed", date: "May 15, 2026", completed: true },
      { label: "Booking Confirmed", date: "May 16, 2026", completed: true },
      { label: "Check-in", date: "Jun 10, 2026", completed: true },
      { label: "Check-out", date: "Jun 14, 2026", completed: true },
    ],
  },
  {
    _id: "4",
    bookingId: "LUM310569",
    userId: "user_1",
    hotelId: 7,
    hotelName: "Desert Oasis Retreat",
    hotelImage: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
    hotelAddress: "Marina Bay, Singapore",
    roomId: "3",
    roomType: "Junior Suite",
    checkIn: "2026-08-20",
    checkOut: "2026-08-23",
    nights: 3,
    guests: 2,
    totalPaid: 1335,
    currency: "USD",
    status: "upcoming",
    paymentStatus: "paid",
    paymentId: "pay_JD4tG5hK8wSn4D",
    createdAt: "2026-07-28T16:45:00Z",
    updatedAt: "2026-07-28T16:50:00Z",
    timeline: [
      { label: "Booking Created", date: "Jul 28, 2026", completed: true },
      { label: "Payment Completed", date: "Jul 28, 2026", completed: true },
      { label: "Booking Confirmed", date: "Jul 28, 2026", completed: true },
      { label: "Check-in", date: "Aug 20, 2026", completed: false },
      { label: "Check-out", date: "Aug 23, 2026", completed: false },
    ],
  },
  {
    _id: "5",
    bookingId: "LUM902347",
    userId: "user_1",
    hotelId: 2,
    hotelName: "City Hotel",
    hotelImage: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80",
    hotelAddress: "Kerala, India",
    roomId: "4",
    roomType: "Standard Twin Room",
    checkIn: "2026-05-01",
    checkOut: "2026-05-03",
    nights: 2,
    guests: 2,
    totalPaid: 358,
    currency: "USD",
    status: "cancelled",
    paymentStatus: "refunded",
    paymentId: "pay_FB3sE4fG7vQm5E",
    createdAt: "2026-04-10T08:30:00Z",
    updatedAt: "2026-04-20T12:00:00Z",
    timeline: [
      { label: "Booking Created", date: "Apr 10, 2026", completed: true },
      { label: "Payment Completed", date: "Apr 10, 2026", completed: true },
      { label: "Booking Confirmed", date: "Apr 10, 2026", completed: true },
      { label: "Cancelled", date: "Apr 20, 2026", completed: true },
      { label: "Refund Processed", date: "Apr 22, 2026", completed: true },
    ],
  },
  {
    _id: "6",
    bookingId: "LUM678901",
    userId: "user_1",
    hotelId: 4,
    hotelName: "Emirates Modern",
    hotelImage: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80",
    hotelAddress: "Dubai Creek, UAE",
    roomId: "2",
    roomType: "Executive Suite",
    checkIn: "2026-10-01",
    checkOut: "2026-10-05",
    nights: 4,
    guests: 3,
    totalPaid: 2048,
    currency: "USD",
    status: "upcoming",
    paymentStatus: "paid",
    paymentId: "pay_VC1wD2cR5xTf6G",
    createdAt: "2026-09-01T11:00:00Z",
    updatedAt: "2026-09-01T11:10:00Z",
    timeline: [
      { label: "Booking Created", date: "Sep 1, 2026", completed: true },
      { label: "Payment Completed", date: "Sep 1, 2026", completed: true },
      { label: "Booking Confirmed", date: "Sep 1, 2026", completed: true },
      { label: "Check-in", date: "Oct 1, 2026", completed: false },
      { label: "Check-out", date: "Oct 5, 2026", completed: false },
    ],
  },
];

export function getMockBookings(userId: string = "user_1"): BookingData[] {
  return MOCK_BOOKINGS.filter((b) => b.userId === userId);
}

export function getMockBookingById(
  bookingId: string
): BookingData | undefined {
  return MOCK_BOOKINGS.find((b) => b.bookingId === bookingId);
}

export function generateInvoiceNumber(bookingId: string): string {
  return `INV-${bookingId}`;
}

export function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString()}`;
}
