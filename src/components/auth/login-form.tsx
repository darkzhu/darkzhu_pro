"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const allowPublicRegister = process.env.NEXT_PUBLIC_ENABLE_PUBLIC_REGISTER === "true";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error")) {
      setError("GitHub 登录失败，请稍后再试");
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username.trim(), nickname: nickname.trim(), password })
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(body?.message || (mode === "login" ? "登录失败，请检查账号和密码" : "注册失败"));
        return;
      }

      if (mode === "register") {
        setMessage("注册成功，请登录");
        setMode("login");
        setPassword("");
        return;
      }

      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      {allowPublicRegister ? (
        <div className="grid grid-cols-2 gap-2 rounded-full bg-mist p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === "login" ? "bg-white text-ink shadow-sm" : "text-ink/55"}`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === "register" ? "bg-white text-ink shadow-sm" : "text-ink/55"}`}
          >
            注册
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-semibold text-ink">
            用户名
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              setError("");
            }}
            className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-clay focus:ring-4 focus:ring-clay/10"
            placeholder="请输入用户名"
          />
        </div>
        {mode === "register" ? (
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-semibold text-ink">
              昵称
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-clay focus:ring-4 focus:ring-clay/10"
              placeholder="不填则使用用户名"
            />
          </div>
        ) : null}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-ink">
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-clay focus:ring-4 focus:ring-clay/10"
            placeholder="请输入密码"
          />
        </div>
        {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}
        {message ? <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{message}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-clay disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isSubmitting ? "提交中..." : mode === "login" ? "登录" : "注册"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-ink/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 font-semibold text-ink/45">or</span>
        </div>
      </div>

      <a
        href="/api/auth/github"
        className="flex w-full items-center justify-center rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-clay hover:text-clay"
      >
        使用 GitHub 登录
      </a>
    </div>
  );
}
