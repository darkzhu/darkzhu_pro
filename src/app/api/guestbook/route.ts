import { NextResponse } from "next/server";

import { addGuestbookMessage, getGuestbookMessages } from "@/lib/interactions";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  return NextResponse.json({ messages: await getGuestbookMessages() });
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "guestbook", 10);

  if (rateLimit.limited) {
    return NextResponse.json({ message: "请求过于频繁，请稍后再试" }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { name?: string; text?: string } | null;

  try {
    return NextResponse.json({ message: await addGuestbookMessage(body?.name || "", body?.text || "") }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Request failed" }, { status: 400 });
  }
}
