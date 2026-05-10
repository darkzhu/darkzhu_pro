import { SectionTitle } from "@/components/layout/section-title";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "关于"
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <SectionTitle
        eyebrow="About"
        title="关于这个博客"
        description="这是一个已经搭好基础框架的个人博客项目，可以继续扩展成技术博客、学习笔记站，或者个人品牌主页。"
      />
      <div className="mt-10 rounded-[28px] border border-ink/10 bg-white/85 p-8 shadow-card">
        <div className="prose">
          <p>
            这个站点目前使用 <code>Next.js</code>、<code>TypeScript</code>、<code>Tailwind CSS</code> 和{" "}
            <code>Markdown</code> 搭建，已经具备继续开发所需的基础结构。
          </p>
          <p>
            你现在可以修改 <code>src/config/site.ts</code> 里的站点名称、简介和社交链接，再把个人信息替换到这个页面里。
          </p>
          <p>
            联系方式示例：<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
