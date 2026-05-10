import { HoleBoard } from "@/components/interactive/hole-board";
import { SectionTitle } from "@/components/layout/section-title";

export const metadata = {
  title: "树洞"
};

export default function HolePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <SectionTitle eyebrow="Whisper Wall" title="树洞" description="登录后可以发送一句弹幕，把当下的心情放在这里。" />
      <div className="mt-10">
        <HoleBoard />
      </div>
    </div>
  );
}
