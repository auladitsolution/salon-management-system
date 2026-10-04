import { describe, it, expect } from "vitest";
import { normalizeBdPhone, isValidBdPhone } from "@/lib/validation/phone";

describe("Bangladesh Phone Number Normalization", () => {
  it("normalizes standard 11-digit local format", () => {
    const res = normalizeBdPhone("01712345678");
    expect(res.isValid).toBe(true);
    expect(res.normalizedLocal).toBe("01712345678");
    expect(res.normalizedE164).toBe("+8801712345678");
    expect(res.operator).toBe("Grameenphone");
  });

  it("normalizes international +880 format", () => {
    const res = normalizeBdPhone("+8801812345678");
    expect(res.isValid).toBe(true);
    expect(res.normalizedLocal).toBe("01812345678");
    expect(res.operator).toBe("Robi");
  });

  it("normalizes numbers with spaces or dashes", () => {
    const res = normalizeBdPhone("019-12 345678");
    expect(res.isValid).toBe(true);
    expect(res.normalizedLocal).toBe("01912345678");
    expect(res.operator).toBe("Banglalink");
  });

  it("identifies valid operators (013, 014, 015, 016, 017, 018, 019)", () => {
    expect(isValidBdPhone("01512345678")).toBe(true); // Teletalk
    expect(isValidBdPhone("01612345678")).toBe(true); // Airtel
    expect(isValidBdPhone("01312345678")).toBe(true); // GP
    expect(isValidBdPhone("01412345678")).toBe(true); // Banglalink
  });

  it("rejects invalid numbers and non-BD formats", () => {
    expect(isValidBdPhone("01212345678")).toBe(false); // Invalid prefix 012
    expect(isValidBdPhone("017123456")).toBe(false);   // Too short
    expect(isValidBdPhone("017123456789")).toBe(false); // Too long
    expect(isValidBdPhone("abcdefghijk")).toBe(false);
  });
});
