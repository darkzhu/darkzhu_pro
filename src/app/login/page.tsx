import Image from "next/image";

import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "登录"
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-white sm:min-h-[calc(100vh-6rem)]">
      <section className="grid min-h-[calc(100vh-5rem)] bg-white sm:min-h-[calc(100vh-6rem)] lg:grid-cols-[70%_30%]">
        <div className="relative hidden min-h-[calc(100vh-5rem)] overflow-hidden bg-mist sm:min-h-[calc(100vh-6rem)] lg:block">
          <Image src="/夏日-夏日海边.png" alt="登录页图片" fill sizes="70vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-white/20" />
          <div className="absolute bottom-10 left-10 right-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-moss">Welcome Back</p>
            <h1 className="mt-3 max-w-md font-display text-5xl font-semibold tracking-tight text-ink">
              欢迎来到我的博客
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-ink/68">
              登录后可以进入后台管理文章、留言、权限、菜单和系统日志。
            </p>
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-white p-5 sm:min-h-[calc(100vh-6rem)] sm:p-8">
          <div className="w-full max-w-sm rounded-[28px] border border-ink/10 bg-white p-7 shadow-[0_18px_45px_rgba(91,52,66,0.08)]">
            <div className="mb-8 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">Account</p>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-ink">账号入口</h2>
              <p className="text-sm leading-6 text-ink/65">登录或注册账号，进入博客管理状态。</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </section>
    </div>
  );
}
