import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { upsertOAuthUser } from "@/lib/admin-users";
import { AUTH_SESSION_COOKIE, AUTH_SESSION_MAX_AGE, createSessionToken } from "@/lib/auth";

type GitHubTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GitHubUser = {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
};

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function exchangeCodeForToken(code: string, redirectUri: string) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: requireEnv("GITHUB_CLIENT_ID"),
      client_secret: requireEnv("GITHUB_CLIENT_SECRET"),
      code,
      redirect_uri: redirectUri
    })
  });
  const body = (await response.json()) as GitHubTokenResponse;

  if (!response.ok || !body.access_token) {
    throw new Error(body.error_description || body.error || "Failed to exchange GitHub token");
  }

  return body.access_token;
}

async function fetchGitHubUser(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub user");
  }

  return (await response.json()) as GitHubUser;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = cookies().get("github-oauth-state")?.value;
  const loginUrl = new URL("/login", request.url);

  if (!code || !state || !savedState || state !== savedState) {
    loginUrl.searchParams.set("error", "github_oauth_state");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const redirectUri = new URL("/api/auth/github/callback", request.url).toString();
    const token = await exchangeCodeForToken(code, redirectUri);
    const githubUser = await fetchGitHubUser(token);
    const user = await upsertOAuthUser({
      provider: "github",
      providerId: String(githubUser.id),
      nickname: githubUser.name || githubUser.login,
      avatar: githubUser.avatar_url
    });
    const sessionUser = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      provider: "GitHub",
      role: user.roleCode,
      permissions: user.permissions
    };
    const sessionToken = await createSessionToken(sessionUser);
    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set(AUTH_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: AUTH_SESSION_MAX_AGE,
      path: "/"
    });
    response.cookies.set("github-oauth-state", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/"
    });

    return response;
  } catch (error) {
    console.error(error);
    loginUrl.searchParams.set("error", "github_oauth_failed");
    return NextResponse.redirect(loginUrl);
  }
}
