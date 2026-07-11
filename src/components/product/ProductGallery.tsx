"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const safeImages = images.length > 0 ? images : ["/placeholder.svg"];

  const goTo = useCallback((index: number) => {
    setSelectedIndex(Math.max(0, Math.min(index, safeImages.length - 1)));
  }, [safeImages.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current || !zoom) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, [zoom]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      goTo(selectedIndex + (diff < 0 ? 1 : -1));
    }
    setTouchStart(null);
  };

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        ref={imageRef}
        className="relative aspect-square rounded-2xl bg-gray-50 overflow-hidden cursor-crosshair group"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={safeImages[selectedIndex]}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn(
            "object-contain p-6 transition-transform duration-200 select-none",
            zoom ? "scale-150" : "scale-100"
          )}
          style={zoom ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
          draggable={false}
          priority
        />

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
          {selectedIndex + 1} / {safeImages.length}
        </div>

        {/* Zoom hint */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
          <ZoomIn className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Mobile nav arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); goTo(selectedIndex - 1); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity md:hidden"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goTo(selectedIndex + 1); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity md:hidden"
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Missing image placeholder */}
        {images.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <ZoomIn className="h-12 w-12 mb-2" />
            <span className="text-sm">No image available</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200",
                i === selectedIndex
                  ? "border-blue-600 ring-1 ring-blue-600"
                  : "border-gray-200 hover:border-gray-300 opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 bg-black/95 border-none">
          <DialogClose className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center">
            <X className="h-5 w-5" />
          </DialogClose>

          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={safeImages[selectedIndex]}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain p-8"
              quality={100}
            />
          </div>

          {/* Lightbox nav */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={() => goTo(selectedIndex - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => goTo(selectedIndex + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
                {selectedIndex + 1} / {safeImages.length}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
