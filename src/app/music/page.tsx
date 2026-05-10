import { SectionTitle } from "@/components/layout/section-title";

export const metadata = {
  title: "音乐"
};

export default function MusicPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <SectionTitle eyebrow="Music" title="音乐" description="这里可以放歌单、播放器或喜欢的音乐记录。" />
      <div className="mt-10 rounded-[28px] border border-ink/10 bg-white/85 p-8 text-ink/68 shadow-card">
        音乐模块占位
      </div>
    </div>
  );
}
