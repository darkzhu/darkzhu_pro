import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { getUploadFilePath, uploadDirectory } from "@/lib/upload-paths";

const contentTypes: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

type RouteContext = {
  params: {
    filename: string;
  };
};

export async function GET(_request: Request, { params }: RouteContext) {
  const filename = path.basename(params.filename);
  const filePath = getUploadFilePath(filename);
  const relativePath = path.relative(uploadDirectory, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return NextResponse.json({ message: "Invalid upload path" }, { status: 400 });
  }

  try {
    const file = await fs.readFile(filePath);
    const contentType = contentTypes[path.extname(filename).toLowerCase()] || "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType
      }
    });
  } catch {
    return NextResponse.json({ message: "Upload not found" }, { status: 404 });
  }
}
