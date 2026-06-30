import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import BookingHistoryCard from "@/components/BookingHistoryCard";

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

beforeEach(() => {
  vi.restoreAllMocks();
});

const mockBookings = {
  bookings: [
    { bookingId: "LUM001", hotelName: "Grand Palace", hotelAddress: "Dubai", roomType: "Deluxe", checkIn: "2026-08-15", checkOut: "2026-08-18", status: "upcoming", totalPaid: 1200, currency: "USD", hotelImage: "https://images.unsplash.com/photo-1?w=600&q=80" },
    { bookingId: "LUM002", hotelName: "Beach Resort", hotelAddress: "Maldives", roomType: "Suite", checkIn: "2026-06-10", checkOut: "2026-06-14", status: "completed", totalPaid: 1600, currency: "USD", hotelImage: "https://images.unsplash.com/photo-2?w=600&q=80" },
    { bookingId: "LUM003", hotelName: "City Hotel", hotelAddress: "NYC", roomType: "Standard", checkIn: "2026-05-01", checkOut: "2026-05-03", status: "cancelled", totalPaid: 350, currency: "USD", hotelImage: "https://images.unsplash.com/photo-3?w=600&q=80" },
  ],
};

describe("BookingHistoryCard", () => {
  it("shows loading skeleton initially", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));

    const { container } = render(<BookingHistoryCard />);

    const skeleton = container.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders bookings after fetch", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockBookings),
    }));

    render(<BookingHistoryCard />);

    expect(await screen.findByText("Grand Palace")).toBeInTheDocument();
    expect(screen.getByText("Beach Resort")).toBeInTheDocument();
    expect(screen.getByText("City Hotel")).toBeInTheDocument();
  });

  it("shows correct status badges", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockBookings),
    }));

    render(<BookingHistoryCard />);

    expect(await screen.findByText("upcoming")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
    expect(screen.getByText("cancelled")).toBeInTheDocument();
  });

  it("shows prices", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockBookings),
    }));

    render(<BookingHistoryCard />);

    expect(await screen.findByText("USD 1,200")).toBeInTheDocument();
    expect(screen.getByText("USD 1,600")).toBeInTheDocument();
    expect(screen.getByText("USD 350")).toBeInTheDocument();
  });

  it("returns null when no bookings", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ bookings: [] }),
    }));

    const { container } = render(<BookingHistoryCard />);
    await waitFor(() => {
      expect(container.innerHTML).toBe("");
    });
  });
});
