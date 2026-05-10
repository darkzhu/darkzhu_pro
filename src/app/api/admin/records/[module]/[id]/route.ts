import { NextResponse } from "next/server";

import { assertAdminRecordModule, deleteAdminRecord, updateAdminRecord, type AdminRecordInput } from "@/lib/admin-records";
import { getSessionUser } from "@/lib/auth";

type RouteContext = {
  params: {
    module: string;
    id: string;
  };
};

async function requireUser() {
  return getSessionUser();
}

export async function PUT(request: Request, { params }: RouteContext) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const input = (await request.json().catch(() => null)) as AdminRecordInput | null;

  if (!input) {
    return NextResponse.json({ message: "Missing request body" }, { status: 400 });
  }

  try {
    assertAdminRecordModule(params.module);
    const record = await updateAdminRecord(params.module, params.id, input);

    if (!record) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ record });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Request failed" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    assertAdminRecordModule(params.module);
    return NextResponse.json({ deleted: await deleteAdminRecord(params.module, params.id) });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Request failed" }, { status: 400 });
  }
}
