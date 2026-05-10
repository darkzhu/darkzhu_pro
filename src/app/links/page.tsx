import { FriendLinks } from "@/components/links/friend-links";

export const metadata = {
  title: "友链"
};

const links = [
  {
    name: "小桃子的角落",
    description: "记录手帐、摄影和日常碎片的温柔小站。",
    href: "#",
    cover: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "云朵便利店",
    description: "分享前端笔记、生活灵感和轻松的想法。",
    href: "#",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "草莓汽水铺",
    description: "关于阅读、旅行和可爱收藏的个人博客。",
    href: "#",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80"
  }
];

export default function LinksPage() {
  return <FriendLinks links={links} />;
}
