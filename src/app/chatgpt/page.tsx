import { SectionTitle } from "@/components/layout/section-title";

export const metadata = {
  title: "ChatGPT"
};

export default function ChatgptPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <SectionTitle eyebrow="AI" title="ChatGPT" description="这里预留给之后接入 ChatGPT 对话或工具模块。" />
      <div className="mt-10 rounded-[28px] border border-ink/10 bg-white/85 p-8 text-ink/68 shadow-card">
        ChatGPT 模块占位
      </div>
    </div>
  );
}
