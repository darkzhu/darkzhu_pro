import { NextResponse } from "next/server";

import {
  createCommentAdmin,
  createGuestbookAdmin,
  createHoleAdmin,
  listCommentsAdmin,
  listGuestbookAdmin,
  listHolesAdmin
} from "@/lib/admin-interactions";
import { getSessionUser } from "@/lib/auth";

type RouteContext = {
  params: {
    module: string;
  };
};

export async function GET(_request: Request, { params }: RouteContext) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (params.module === "guestbook") {
    return NextResponse.json({ items: await listGuestbookAdmin() });
  }

  if (params.module === "comments") {
    return NextResponse.json({ items: await listCommentsAdmin() });
  }

  if (params.module === "holes") {
    return NextResponse.json({ items: await listHolesAdmin() });
  }

  return NextResponse.json({ message: "Unsupported module" }, { status: 400 });
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const input = (await request.json().catch(() => null)) as Record<string, string | number> | null;

  if (!input) {
    return NextResponse.json({ message: "Missing request body" }, { status: 400 });
  }

  if (params.module === "guestbook") {
    const id = await createGuestbookAdmin({
      name: String(input.name || ""),
      text: String(input.text || ""),
      likes: Number(input.likes || 0)
    });
    return NextResponse.json({ id }, { status: 201 });
  }

  if (params.module === "comments") {
    const id = await createCommentAdmin({
      postSlug: String(input.postSlug || ""),
      name: String(input.name || ""),
      text: String(input.text || ""),
      likes: Number(input.likes || 0)
    });
    return NextResponse.json({ id }, { status: 201 });
  }

  if (params.module === "holes") {
    const id = await createHoleAdmin({
      text: String(input.text || ""),
      top: Number(input.top || 0),
      duration: Number(input.duration || 16)
    });
    return NextResponse.json({ id }, { status: 201 });
  }

  return NextResponse.json({ message: "Unsupported module" }, { status: 400 });
}
