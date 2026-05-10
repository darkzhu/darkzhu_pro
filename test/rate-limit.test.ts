import { describe, expect, it } from "vitest";

import { checkRateLimit } from "@/lib/rate-limit";

function requestForIp(ip: string) {
  return new Request("http://localhost/api/test", {
    headers: {
      "x-forwarded-for": ip
    }
  });
}

describe("checkRateLimit", () => {
  it("allows requests until the limit is reached", () => {
    const key = `limit-${crypto.randomUUID()}`;
    const request = requestForIp("192.0.2.1");

    expect(checkRateLimit(request, key, 2).limited).toBe(false);
    expect(checkRateLimit(request, key, 2).limited).toBe(false);
    expect(checkRateLimit(request, key, 2).limited).toBe(true);
  });

  it("tracks different IPs separately", () => {
    const key = `limit-${crypto.randomUUID()}`;

    expect(checkRateLimit(requestForIp("192.0.2.10"), key, 1).limited).toBe(false);
    expect(checkRateLimit(requestForIp("192.0.2.11"), key, 1).limited).toBe(false);
    expect(checkRateLimit(requestForIp("192.0.2.10"), key, 1).limited).toBe(true);
  });
});
