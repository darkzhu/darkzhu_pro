import { NextResponse } from "next/server";

import { assertAdminRecordModule, createAdminRecord, listAdminRecords, type AdminRecordInput } from "@/lib/admin-records";
import { getSessionUser } from "@/lib/auth";

type RouteContext = {
  params: {
    module: string;
  };
};

async function requireUser() {
  return getSessionUser();
}

export async function GET(_request: Request, { params }: RouteContext) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    assertAdminRecordModule(params.module);
    return NextResponse.json({ records: await listAdminRecords(params.module) });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Request failed" }, { status: 400 });
  }
}

export async function POST(request: Request, { params }: RouteContext) {
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
    return NextResponse.json({ record: await createAdminRecord(params.module, input) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Request failed" }, { status: 400 });
  }
}
