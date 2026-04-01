import PageHeader from "@/components/ui/PageHeader";

export default function PlaceholderPage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto">
            <span className="text-2xl">🚧</span>
          </div>
          <p className="text-sm text-muted-foreground font-mono">Module coming soon</p>
        </div>
      </div>
    </div>
  );
}
