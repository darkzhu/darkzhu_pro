import { NextResponse } from "next/server";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function GET(request: Request) {
  const redirectUri = new URL("/api/auth/github/callback", request.url);
  const state = crypto.randomUUID();
  const githubUrl = new URL("https://github.com/login/oauth/authorize");

  githubUrl.searchParams.set("client_id", requireEnv("GITHUB_CLIENT_ID"));
  githubUrl.searchParams.set("redirect_uri", redirectUri.toString());
  githubUrl.searchParams.set("scope", "read:user user:email");
  githubUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(githubUrl);

  response.cookies.set("github-oauth-state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/"
  });

  return response;
}
