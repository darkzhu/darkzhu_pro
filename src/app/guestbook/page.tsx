import { Guestbook } from "@/components/interactive/guestbook";
import { SectionTitle } from "@/components/layout/section-title";

export const metadata = {
  title: "留言板"
};

export default function GuestbookPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <SectionTitle eyebrow="Guestbook" title="留言板" description="写下想说的话，也可以给喜欢的留言点个赞。" />
      <div className="mt-10">
        <Guestbook />
      </div>
    </div>
  );
}
