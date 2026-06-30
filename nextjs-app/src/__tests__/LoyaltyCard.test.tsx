import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LoyaltyCard from "@/components/LoyaltyCard";

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("LoyaltyCard", () => {
  it("renders with default data when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));

    render(<LoyaltyCard />);

    expect(await screen.findByText("Loyalty Program")).toBeInTheDocument();
    expect(screen.getAllByText("Gold").length).toBe(2);
    expect(screen.getByText("8,200")).toBeInTheDocument();
    expect(screen.getByText("Platinum")).toBeInTheDocument();
  });

  it("renders with fetched data", async () => {
    const mockData = {
      loyalty: {
        points: 12000, tier: "Gold", nextTier: "Platinum",
        pointsToNext: 3000, totalNights: 40, pointsThisYear: 8000,
        perks: ["Free breakfast", "Room upgrades"],
      },
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockData),
    }));

    render(<LoyaltyCard />);

    expect(await screen.findByText("12,000")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("8,000")).toBeInTheDocument();
    expect(screen.getByText("Free breakfast")).toBeInTheDocument();
    expect(screen.getByText("Room upgrades")).toBeInTheDocument();
  });
});
