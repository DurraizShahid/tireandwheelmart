"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Check, ChevronsUpDown, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { VehicleFilter } from "@/lib/catalog-types";

interface VehicleSelectorProps {
  onFitmentSelect: (vehicle: VehicleFilter, tireSizes: string[]) => void;
  onClear: () => void;
  selectedVehicle?: VehicleFilter;
}

interface ModelOption {
  model: string;
  year_start: number;
  year_end: number;
}

interface FitmentResult {
  id: string;
  tire_size: string;
  bolt_pattern: string | null;
  offset_range: string | null;
}

export function VehicleSelector({ onFitmentSelect, onClear, selectedVehicle }: VehicleSelectorProps) {
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [fitments, setFitments] = useState<FitmentResult[]>([]);

  const [makeOpen, setMakeOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const [make, setMake] = useState(selectedVehicle?.make ?? "");
  const [model, setModel] = useState(selectedVehicle?.model ?? "");
  const [year, setYear] = useState<number | null>(selectedVehicle?.year ?? null);

  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingFitments, setLoadingFitments] = useState(false);

  const [selectedModelInfo, setSelectedModelInfo] = useState<ModelOption | null>(null);

  const onFitmentSelectRef = useRef(onFitmentSelect);
  onFitmentSelectRef.current = onFitmentSelect;
  const onClearRef = useRef(onClear);
  onClearRef.current = onClear;

  useEffect(() => {
    if (!selectedVehicle) {
      setMake("");
      setModel("");
      setYear(null);
      setSelectedModelInfo(null);
      setFitments([]);
    }
  }, [selectedVehicle]);

  useEffect(() => {
    fetch("/api/fitments/makes")
      .then((r) => r.json())
      .then((data) => setMakes(Array.isArray(data) ? data : []))
      .catch(() => setMakes([]));
  }, []);

  useEffect(() => {
    if (!make) {
      setModels([]);
      setModel("");
      setYear(null);
      setSelectedModelInfo(null);
      setFitments([]);
      return;
    }
    setLoadingModels(true);
    setModel("");
    setYear(null);
    setSelectedModelInfo(null);
    setFitments([]);
    fetch(`/api/fitments/models?make=${encodeURIComponent(make)}`)
      .then((r) => r.json())
      .then((data) => setModels(Array.isArray(data) ? data : []))
      .catch(() => setModels([]))
      .finally(() => setLoadingModels(false));
  }, [make]);

  useEffect(() => {
    if (!model || !make) {
      setFitments([]);
      return;
    }
    const info = models.find((m) => m.model === model) ?? null;
    setSelectedModelInfo(info);
    setYear(null);
    setFitments([]);
  }, [model, models, make]);

  useEffect(() => {
    if (!make || !model || year === null) {
      setFitments([]);
      return;
    }
    setLoadingFitments(true);
    fetch(`/api/fitments/lookup?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${year}`)
      .then((r) => r.json())
      .then((data) => {
        const results = Array.isArray(data) ? data : [];
        setFitments(results);
        const tireSizes = [...new Set(results.map((f: FitmentResult) => f.tire_size))];
        if (tireSizes.length > 0) {
          onFitmentSelectRef.current({ make, model, year }, tireSizes);
        }
      })
      .catch(() => setFitments([]))
      .finally(() => setLoadingFitments(false));
  }, [make, model, year]);

  const handleClear = useCallback(() => {
    setMake("");
    setModel("");
    setYear(null);
    setSelectedModelInfo(null);
    setFitments([]);
    onClearRef.current();
  }, []);

  const yearOptions = selectedModelInfo
    ? Array.from(
        { length: selectedModelInfo.year_end - selectedModelInfo.year_start + 1 },
        (_, i) => selectedModelInfo.year_start + i
      )
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Car className="h-5 w-5 text-blue-600" />
        <span className="font-semibold text-foreground">Find Your Fit</span>
        {selectedVehicle && (
          <Button variant="ghost" size="sm" className="ml-auto h-auto p-0 text-xs text-muted-foreground" onClick={handleClear}>
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {/* Make Combobox */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Make</label>
          <Popover open={makeOpen} onOpenChange={setMakeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={makeOpen}
                className="w-[180px] justify-between"
              >
                {make || "Select make..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0">
              <Command>
                <CommandInput placeholder="Search make..." />
                <CommandList>
                  <CommandEmpty>No make found.</CommandEmpty>
                  <CommandGroup>
                    {makes.map((m) => (
                      <CommandItem
                        key={m}
                        value={m}
                        onSelect={() => {
                          setMake(m);
                          setMakeOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", make === m ? "opacity-100" : "opacity-0")} />
                        {m}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Model Combobox */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Model</label>
          <Popover open={modelOpen} onOpenChange={setModelOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={modelOpen}
                disabled={!make || loadingModels}
                className="w-[200px] justify-between"
              >
                {loadingModels ? "Loading..." : (model || "Select model...")}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search model..." />
                <CommandList>
                  <CommandEmpty>No model found.</CommandEmpty>
                  <CommandGroup>
                    {models.map((m) => (
                      <CommandItem
                        key={m.model}
                        value={m.model}
                        onSelect={() => {
                          setModel(m.model);
                          setModelOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", model === m.model ? "opacity-100" : "opacity-0")} />
                        {m.model}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Year Combobox */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Year</label>
          <Popover open={yearOpen} onOpenChange={setYearOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={yearOpen}
                disabled={!model || yearOptions.length === 0}
                className="w-[130px] justify-between"
              >
                {year ?? "Select year..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[130px] p-0">
              <Command>
                <CommandInput placeholder="Search year..." />
                <CommandList>
                  <CommandEmpty>No year found.</CommandEmpty>
                  <CommandGroup>
                    {yearOptions.map((y) => (
                      <CommandItem
                        key={y}
                        value={String(y)}
                        onSelect={() => {
                          setYear(y);
                          setYearOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", year === y ? "opacity-100" : "opacity-0")} />
                        {y}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Results */}
      {loadingFitments && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Checking fitment...
        </div>
      )}

      {!loadingFitments && fitments.length > 0 && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <p className="text-sm font-semibold text-foreground mb-2">
            Compatible sizes for {make} {model} ({year})
          </p>
          <div className="space-y-2">
            {fitments.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm border border-blue-100">
                <span className="font-mono font-medium text-foreground">{f.tire_size}</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {f.bolt_pattern && <span>Bolt: {f.bolt_pattern}</span>}
                  {f.offset_range && <span>Offset: {f.offset_range}mm</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loadingFitments && make && model && year !== null && fitments.length === 0 && (
        <p className="text-sm text-muted-foreground">No fitment data found for this vehicle.</p>
      )}
    </div>
  );
}
