import { describe, it, expect } from "vitest";
import { sanitize, sanitizeEmail, sanitizePhone, sanitizeName } from "@/lib/sanitize";

describe("sanitize", () => {
  it("strips HTML tags", () => {
    expect(sanitize("<script>alert('xss')</script>Hello")).toBe("alert('xss')Hello");
  });

  it("trims whitespace", () => {
    expect(sanitize("  hello  ")).toBe("hello");
  });

  it("truncates at 5000 chars", () => {
    const long = "a".repeat(6000);
    const result = sanitize(long);
    expect(result.length).toBe(5000);
  });

  it("handles empty string", () => {
    expect(sanitize("")).toBe("");
  });

  it("handles mixed content", () => {
    expect(sanitize("<b>Bold</b> and <i>italic</i>")).toBe("Bold and italic");
  });
});

describe("sanitizeEmail", () => {
  it("lowercases and trims", () => {
    expect(sanitizeEmail("  Test@Example.COM  ")).toBe("test@example.com");
  });

  it("truncates at 254 chars", () => {
    const local = "a".repeat(200);
    const domain = "b".repeat(100);
    const email = `${local}@${domain}.com`;
    const result = sanitizeEmail(email);
    expect(result.length).toBe(254);
  });
});

describe("sanitizePhone", () => {
  it("keeps digits, +, -, (), and spaces", () => {
    expect(sanitizePhone("+1 (555) 123-4567")).toBe("+1 (555) 123-4567");
  });

  it("strips letters", () => {
    expect(sanitizePhone("abc+1 (555) def")).toBe("+1 (555)");
  });

  it("truncates at 20 chars", () => {
    expect(sanitizePhone("+1 (555) 123-4567 ext 9999").length).toBe(20);
  });
});

describe("sanitizeName", () => {
  it("strips HTML tags and invalid chars", () => {
    expect(sanitizeName("<script>alert(1)</script>John")).toBe("alert1John");
  });

  it("removes invalid characters", () => {
    expect(sanitizeName("John@Doe!")).toBe("JohnDoe");
  });

  it("allows hyphens and apostrophes", () => {
    expect(sanitizeName("Jean-Pierre O'Brian")).toBe("Jean-Pierre O'Brian");
  });

  it("truncates at 100 chars", () => {
    expect(sanitizeName("a".repeat(150)).length).toBe(100);
  });
});
