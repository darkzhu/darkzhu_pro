import { NextResponse } from "next/server";

import { likeGuestbookMessage } from "@/lib/interactions";
import { checkRateLimit } from "@/lib/rate-limit";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  const rateLimit = checkRateLimit(request, "guestbook-like", 30);

  if (rateLimit.limited) {
    return NextResponse.json({ message: "请求过于频繁，请稍后再试" }, { status: 429 });
  }

  const message = await likeGuestbookMessage(params.id);

  if (!message) {
    return NextResponse.json({ message: "Message not found" }, { status: 404 });
  }

  return NextResponse.json({ message });
}
