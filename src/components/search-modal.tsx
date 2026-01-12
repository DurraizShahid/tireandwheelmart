"use client";

import React, { useState, useEffect } from "react";
import { X, MapPin, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onOpenChange }) => {
  const router = useRouter();
  const [zipCode, setZipCode] = useState("");
  const [searchMode, setSearchMode] = useState<"vehicle" | "size" | "brand" | "type" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (mode: "vehicle" | "size" | "brand" | "type") => {
    // Navigate to search page with the selected mode
    const params = new URLSearchParams();
    params.append("mode", mode);
    if (searchQuery) {
      params.append("q", searchQuery);
    }
    router.push(`/search?${params.toString()}`);
    onOpenChange(false);
  };

  const handleGuidedShopping = () => {
    // Navigate to guided shopping page or search
    router.push("/search?mode=guided");
    onOpenChange(false);
  };

  useEffect(() => {
    // Override the overlay background color when modal is open
    if (open) {
      const overlay = document.querySelector('[data-radix-dialog-overlay]');
      if (overlay) {
        (overlay as HTMLElement).style.backgroundColor = 'rgba(220, 38, 38, 0.95)';
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-full h-screen max-h-screen p-0 bg-[#DC2626] border-0 overflow-y-auto fixed inset-0 translate-x-0 translate-y-0 rounded-none [&>button]:hidden z-[100]">
        <VisuallyHidden>
          <DialogTitle>Search by vehicle</DialogTitle>
        </VisuallyHidden>
        <div className="relative w-full min-h-full flex flex-col text-white">
          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-6 right-6 z-50 text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="px-8 pt-12 pb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Search by vehicle
            </h1>
            
            {/* Location Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5" />
                <span className="text-lg font-medium">Delivering to:</span>
                <span className="h-2 w-2 rounded-full bg-white"></span>
                <button
                  onClick={() => {
                    const newZip = prompt("Enter your zip code:", zipCode);
                    if (newZip) setZipCode(newZip);
                  }}
                  className="underline hover:no-underline text-lg font-medium"
                >
                  {zipCode || "Change zip code"}
                </button>
              </div>
              <p className="text-sm text-white/90 ml-7">
                We use your location to provide accurate pricing and help you find local shops.
              </p>
            </div>

            {/* Search Input */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Shop tires by vehicles, tire size or brand"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                    onOpenChange(false);
                  }
                }}
                className="w-full h-14 text-lg bg-white text-gray-900 border-0 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>

          {/* Main Content - Two Columns */}
          <div className="flex-1 px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
              {/* Left Column - SHOP TIRES BY */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold uppercase tracking-wide mb-6">
                  Shop Tires By
                </h2>
                
                <button
                  onClick={() => handleSearch("vehicle")}
                  className="w-full h-20 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white rounded-lg flex items-center justify-between px-6 transition-all group"
                >
                  <span className="text-2xl font-semibold text-white">Vehicle</span>
                  <ChevronRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleSearch("size")}
                  className="w-full h-20 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white rounded-lg flex items-center justify-between px-6 transition-all group"
                >
                  <span className="text-2xl font-semibold text-white">Tire size</span>
                  <ChevronRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Right Column - FILTER BY (OPTIONAL) */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold uppercase tracking-wide mb-6">
                  Filter By (Optional)
                </h2>
                
                <button
                  onClick={() => handleSearch("brand")}
                  className="w-full h-20 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white rounded-lg flex items-center justify-between px-6 transition-all group"
                >
                  <span className="text-2xl font-semibold text-white">Tire Brand</span>
                  <ChevronRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleSearch("type")}
                  className="w-full h-20 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white rounded-lg flex items-center justify-between px-6 transition-all group"
                >
                  <span className="text-2xl font-semibold text-white">Tire Type</span>
                  <ChevronRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer - Guided Shopping */}
          <div className="px-8 pb-12 pt-8 border-t border-white/20 mt-auto">
            <div className="text-center mb-6">
              <p className="text-lg">
                Need help searching? Try our new personalized search.
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleGuidedShopping}
                className="bg-white text-[#DC2626] hover:bg-gray-100 font-semibold text-lg px-8 py-6 rounded-lg border-2 border-white transition-colors"
              >
                Guided Shopping
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;