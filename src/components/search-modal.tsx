"use client";

import React, { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tireBrands = [
  "Michelin",
  "Bridgestone",
  "Continental",
  "Goodyear",
  "Pirelli",
  "Toyo",
  "Cooper",
  "Firestone",
  "Hercules",
  "Nokian",
];

const tireTypes = [
  "All-Season",
  "Summer",
  "Winter",
  "Performance",
  "All-Terrain",
];

const SearchModal: React.FC<SearchModalProps> = ({ open, onOpenChange }) => {
  const router = useRouter();
  const [zipCode, setZipCode] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [tireSize, setTireSize] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleSearch = () => {
    // Build search query based on selected filters
    const params = new URLSearchParams();
    
    if (vehicle) params.append("vehicle", vehicle);
    if (tireSize) params.append("size", tireSize);
    if (selectedBrand) params.append("brand", selectedBrand);
    if (selectedType) params.append("type", selectedType);

    // Navigate to search results or products page
    if (params.toString()) {
      router.push(`/search?${params.toString()}`);
    } else {
      router.push("/search");
    }
    
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
          <div className="px-8 pt-8 pb-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop tires by vehicles, tire size or brand
            </h1>
            
            {/* Location Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">Delivering to:</span>
                <button
                  onClick={() => {
                    const newZip = prompt("Enter your zip code:", zipCode);
                    if (newZip) setZipCode(newZip);
                  }}
                  className="underline hover:no-underline text-lg"
                >
                  {zipCode || "Change zip code"}
                </button>
              </div>
              <p className="text-sm text-white/90">
                We use your location to provide accurate pricing and help you find local shops.
              </p>
            </div>
          </div>

          {/* Main Content - Two Columns */}
          <div className="flex-1 px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
              {/* Left Column - SHOP TIRES BY */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold uppercase tracking-wide mb-4">
                  SHOP TIRES BY
                </h2>
                
                {/* Vehicle Input */}
                <div>
                  <label className="block text-xl font-medium mb-2">
                    Vehicle
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your vehicle"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full h-14 text-lg bg-white text-gray-900 border-2 border-white/20 rounded-lg focus:border-white focus:ring-2 focus:ring-white/50"
                  />
                </div>

                {/* Tire Size Input */}
                <div>
                  <label className="block text-xl font-medium mb-2">
                    Tire size
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter tire size (e.g., 225/45R17)"
                    value={tireSize}
                    onChange={(e) => setTireSize(e.target.value)}
                    className="w-full h-14 text-lg bg-white text-gray-900 border-2 border-white/20 rounded-lg focus:border-white focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>

              {/* Right Column - FILTER BY (OPTIONAL) */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold uppercase tracking-wide mb-4">
                  FILTER BY (OPTIONAL)
                </h2>
                
                {/* Tire Brand Dropdown */}
                <div>
                  <label className="block text-xl font-medium mb-2">
                    Tire Brand
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full h-14 text-lg bg-white text-gray-900 border-2 border-white/20 rounded-lg focus:border-white focus:ring-2 focus:ring-white/50 px-4"
                  >
                    <option value="">Select a brand</option>
                    {tireBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tire Type Dropdown */}
                <div>
                  <label className="block text-xl font-medium mb-2">
                    Tire Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full h-14 text-lg bg-white text-gray-900 border-2 border-white/20 rounded-lg focus:border-white focus:ring-2 focus:ring-white/50 px-4"
                  >
                    <option value="">Select a type</option>
                    {tireTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Guided Shopping */}
          <div className="px-8 pb-8 pt-4 border-t border-white/20">
            <div className="text-center mb-4">
              <p className="text-lg">
                NEED HELP SEARCHING? TRY OUR NEW PERSONALIZED SEARCH.
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleSearch}
                className="bg-white text-[#DC2626] hover:bg-gray-100 font-semibold text-lg px-8 py-6 rounded-lg border-2 border-white transition-colors"
              >
                Search Tires
              </Button>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                className="bg-transparent text-white border-2 border-white hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-lg transition-colors"
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