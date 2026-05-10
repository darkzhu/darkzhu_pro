import { NextResponse } from "next/server";

import {
  deleteCommentAdmin,
  deleteGuestbookAdmin,
  deleteHoleAdmin,
  updateCommentAdmin,
  updateGuestbookAdmin,
  updateHoleAdmin
} from "@/lib/admin-interactions";
import { getSessionUser } from "@/lib/auth";

type RouteContext = {
  params: {
    module: string;
    id: string;
  };
};

export async function PUT(request: Request, { params }: RouteContext) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const input = (await request.json().catch(() => null)) as Record<string, string | number> | null;

  if (!input) {
    return NextResponse.json({ message: "Missing request body" }, { status: 400 });
  }

  if (params.module === "guestbook") {
    return NextResponse.json({
      updated: await updateGuestbookAdmin(params.id, {
        name: String(input.name || ""),
        text: String(input.text || ""),
        likes: Number(input.likes || 0)
      })
    });
  }

  if (params.module === "comments") {
    return NextResponse.json({
      updated: await updateCommentAdmin(params.id, {
        name: String(input.name || ""),
        text: String(input.text || ""),
        likes: Number(input.likes || 0)
      })
    });
  }

  if (params.module === "holes") {
    return NextResponse.json({
      updated: await updateHoleAdmin(params.id, {
        text: String(input.text || ""),
        top: Number(input.top || 0),
        duration: Number(input.duration || 16)
      })
    });
  }

  return NextResponse.json({ message: "Unsupported module" }, { status: 400 });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (params.module === "guestbook") {
    return NextResponse.json({ deleted: await deleteGuestbookAdmin(params.id) });
  }

  if (params.module === "comments") {
    return NextResponse.json({ deleted: await deleteCommentAdmin(params.id) });
  }

  if (params.module === "holes") {
    return NextResponse.json({ deleted: await deleteHoleAdmin(params.id) });
  }

  return NextResponse.json({ message: "Unsupported module" }, { status: 400 });
}
