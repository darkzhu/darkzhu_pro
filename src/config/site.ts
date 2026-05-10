import { publicEnv } from "@/config/runtime";

export const siteConfig = {
  name: publicEnv("NEXT_PUBLIC_SITE_NAME", "大可猪的日常"),
  title: publicEnv("NEXT_PUBLIC_SITE_TITLE", "记录生活里闪闪发光的小日常"),
  description: publicEnv("NEXT_PUBLIC_SITE_DESCRIPTION", "一个装满随笔、照片、灵感和温柔片刻的个人小站。"),
  url: publicEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  author: publicEnv("NEXT_PUBLIC_SITE_AUTHOR", "大可猪"),
  authorBio: publicEnv("NEXT_PUBLIC_SITE_AUTHOR_BIO", "把普通日子写成一颗亮晶晶的小糖豆。"),
  authorAvatar: publicEnv("NEXT_PUBLIC_SITE_AUTHOR_AVATAR", "/亚丝娜.png"),
  announcement: {
    text: "博客持续整理中，新的生活记录和灵感清单会陆续更新。",
    href: "/posts"
  },
  launchedAt: "2026-04-28T00:00:00+08:00",
  dailyQuote: "慢慢来，比较快。把今天过好，答案会在路上出现。",
  heroImage: "/hero-bg.png",
  defaultPostCover: "/hero-bg.png",
  email: publicEnv("NEXT_PUBLIC_SITE_EMAIL", "hello@example.com"),
  locale: "zh_CN",
  keywords: ["个人博客", "生活日常", "Next.js", "随笔"],
  nav: [
    { href: "/", label: "首页", icon: "⌂" },
    {
      href: "/archive",
      label: "归档",
      icon: "◷",
      children: [
        { href: "/archive", label: "时间轴", icon: "•" },
        { href: "/categories", label: "分类", icon: "▦" },
        { href: "/tags", label: "标签", icon: "#" }
      ]
    },
    {
      href: "/hole",
      label: "其他",
      icon: "✦",
      children: [
        { href: "/hole", label: "树洞", icon: "✦" },
        { href: "/guestbook", label: "留言板", icon: "☰" },
        { href: "/chatgpt", label: "ChatGPT", icon: "AI" }
      ]
    },
    { href: "/links", label: "友链", icon: "♡" },
    { href: "/music", label: "音乐", icon: "♪" },
    { href: "/about", label: "关于", icon: "?" }
  ],
  social: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "X", href: "https://x.com/" }
  ],
  feed: {
    title: `${publicEnv("NEXT_PUBLIC_SITE_NAME", "大可猪的日常")} RSS Feed`,
    path: "/rss.xml"
  },
  ogImage: "/og-image.png"
};
