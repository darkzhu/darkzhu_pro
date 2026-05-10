import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-ink/70 md:flex-row md:items-center md:justify-between">
        <p>{new Date().getFullYear()} {siteConfig.name}. Built for writing and shipping ideas.</p>
        <div className="flex gap-4">
          {siteConfig.social.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-clay"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
