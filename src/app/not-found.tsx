import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">404</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-ink">页面不存在</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-ink/70">
        这个地址目前没有对应内容。你可以先回到首页，或者继续去文章列表页看看。
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper">
          回首页
        </Link>
        <Link href="/posts" className="rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-semibold text-ink">
          去文章页
        </Link>
      </div>
    </div>
  );
}
