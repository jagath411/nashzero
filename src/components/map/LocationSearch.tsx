import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { TbSearch, TbMapPin, TbX } from "react-icons/tb";

interface LocationSuggestion {
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "recent" | "suggestion" | "search";
}

interface LocationSearchProps {
  onLocationSelect: (location: { name: string; lat: number; lng: number }) => void;
  onClear?: () => void;
}

const POPULAR_LOCATIONS: LocationSuggestion[] = [
  {
    name: "Downtown Dubai",
    address: "Dubai, UAE",
    lat: 25.1972,
    lng: 55.2744,
    type: "suggestion"
  },
  {
    name: "Business Bay",
    address: "Dubai, UAE",
    lat: 25.1887,
    lng: 55.2739,
    type: "suggestion"
  },
  {
    name: "Dubai Marina",
    address: "Dubai, UAE",
    lat: 25.0801,
    lng: 55.1455,
    type: "suggestion"
  },
  {
    name: "Jumeirah Lake Towers",
    address: "Dubai, UAE",
    lat: 25.1401,
    lng: 55.1587,
    type: "suggestion"
  },
  {
    name: "Palm Jumeirah",
    address: "Dubai, UAE",
    lat: 25.1124,
    lng: 55.1397,
    type: "suggestion"
  },
  {
    name: "Emirates Hills",
    address: "Dubai, UAE",
    lat: 25.1275,
    lng: 55.2182,
    type: "suggestion"
  },
];

export default function LocationSearch({ onLocationSelect, onClear }: LocationSearchProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<LocationSuggestion[]>(POPULAR_LOCATIONS);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setShowSuggestions(true);

    if (value.trim()) {
      const search = value.toLowerCase();
      const filtered = POPULAR_LOCATIONS.filter(
        (loc) =>
          loc.name.toLowerCase().includes(search) ||
          loc.address.toLowerCase().includes(search)
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(POPULAR_LOCATIONS);
    }
  }, []);

  const handleSelectLocation = useCallback(
    (location: LocationSuggestion) => {
      onLocationSelect({
        name: location.name,
        lat: location.lat,
        lng: location.lng,
      });
      setInput(location.name);
      setShowSuggestions(false);
    },
    [onLocationSelect]
  );

  const handleClear = useCallback(() => {
    setInput("");
    setShowSuggestions(false);
    onClear?.();
  }, [onClear]);

  return (
    <div className="absolute top-4 left-4 z-20 w-96">
      {/* Search Box */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-3 shadow-lg">
          <TbSearch className="text-muted-foreground flex-shrink-0" size={18} />
          <input
            type="text"
            placeholder="Search location (e.g., Downtown Dubai, Business Bay...)"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          {input && (
            <button
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <TbX size={18} />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {filteredSuggestions.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectLocation(loc)}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-start gap-3 border-b border-border/50 last:border-b-0 group"
                >
                  <TbMapPin className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {loc.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{loc.address}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Search Tips */}
            <div className="px-4 py-3 bg-muted/30 border-t border-border/50">
              <p className="text-xs text-muted-foreground font-mono">
                💡 Tip: Type a location name to filter suggestions
              </p>
            </div>
          </div>
        )}

        {/* No Results */}
        {showSuggestions && filteredSuggestions.length === 0 && input.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-4">
            <p className="text-xs text-muted-foreground text-center">
              No locations found for "{input}".<br />
              <span className="text-primary font-medium">Try a different search</span>
            </p>
          </div>
        )}
      </div>

      {/* Quick Help */}
      <div className="mt-3 bg-card/80 backdrop-blur border border-border rounded-lg p-3 space-y-2">
        <p className="text-xs font-semibold text-foreground">Getting Started:</p>
        <ul className="text-xs text-muted-foreground space-y-1 font-mono">
          <li>1️⃣ Search for a location above</li>
          <li>2️⃣ Use drawing tools to mark site boundary</li>
          <li>3️⃣ Review metrics and proceed to studio</li>
        </ul>
      </div>
    </div>
  );
}
