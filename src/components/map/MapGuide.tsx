import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TbX, TbChevronDown, TbChevronUp } from "react-icons/tb";

interface MapGuideProps {
  onDismiss?: () => void;
}

export default function MapGuide({ onDismiss }: MapGuideProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="absolute top-4 right-4 z-20 px-3 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors text-xs font-semibold text-foreground flex items-center gap-2"
      >
        <TbChevronUp size={14} />
        Show Guide
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-20 w-80 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Map Guide</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <TbChevronUp size={16} />
          </button>
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <TbX size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Step 1 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h4 className="text-sm font-semibold text-foreground">Search Location</h4>
          </div>
          <p className="text-xs text-muted-foreground ml-8 leading-relaxed">
            Use the search box on the <strong>top-left</strong> to find your project location. You'll see suggestions as you type.
          </p>
        </div>

        {/* Step 2 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h4 className="text-sm font-semibold text-foreground">Draw Boundary</h4>
          </div>
          <p className="text-xs text-muted-foreground ml-8 leading-relaxed">
            Once you've selected a location, drawing tools will appear on the <strong>bottom-left</strong>. Choose Polygon (free-form) or Rectangle.
          </p>
        </div>

        {/* Step 3 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              3
            </div>
            <h4 className="text-sm font-semibold text-foreground">Mark Site</h4>
          </div>
          <p className="text-xs text-muted-foreground ml-8 leading-relaxed">
            Click on the map to add points. When done, click ✓ to complete. Your site boundary will be highlighted.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-muted/50 rounded-lg p-3 border border-border/50 space-y-1">
          <p className="text-xs font-semibold text-foreground">💡 Pro Tips:</p>
          <ul className="text-[11px] text-muted-foreground space-y-0.5">
            <li>• <strong>Search tips:</strong> Type location name to filter</li>
            <li>• <strong>Rectangle:</strong> Faster for regular plots</li>
            <li>• <strong>Polygon:</strong> Better for irregular shapes</li>
            <li>• <strong>Click Clear:</strong> Reset and start over</li>
          </ul>
        </div>

        {/* CTA */}
        <Button
          size="sm"
          className="w-full text-xs"
          onClick={onDismiss}
        >
          Got It! Start Mapping
        </Button>
      </div>
    </div>
  );
}
