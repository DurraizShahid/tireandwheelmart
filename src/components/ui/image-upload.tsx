"use client";

import { useState, useRef, useMemo } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Loader2, X, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 10,
  label = "Upload Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const urls = useMemo(
    () => multiple ? (Array.isArray(value) ? value : []) : [value as string].filter(Boolean),
    [value, multiple]
  );
  const isSingle = !multiple;

  const uploadFiles = async (files: FileList | File[]) => {
    const supabase = createBrowserClient();
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) {
      toast.error("Please select image files");
      return;
    }

    const remaining = maxFiles - urls.length;
    const toUpload = fileArray.slice(0, remaining);
    if (toUpload.length < fileArray.length) {
      toast.error(`Only ${remaining} more image(s) allowed`);
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of toUpload) {
        const ext = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data, error } = await supabase.storage
          .from("products")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (error) {
          if (error.message.includes("bucket")) {
            toast.error("Storage bucket 'products' not found. Create it in Supabase Dashboard.");
          } else {
            toast.error(`Upload failed: ${error.message}`);
          }
          break;
        }

        const { data: urlData } = supabase.storage.from("products").getPublicUrl(data.path);
        uploadedUrls.push(urlData.publicUrl);
      }

      if (uploadedUrls.length > 0) {
        const newUrls = multiple ? [...urls, ...uploadedUrls] : uploadedUrls[uploadedUrls.length - 1];
        onChange(newUrls);
        toast.success(`${uploadedUrls.length} image(s) uploaded`);
      }
    } finally {
      setUploading(false);
    }
  };

  const removeUrl = (index: number) => {
    if (multiple) {
      const newUrls = urls.filter((_, i) => i !== index);
      onChange(newUrls);
    } else {
      onChange("");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <div
        ref={dragRef}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <Upload className="h-6 w-6" />
            <span className="text-sm font-medium">{label}</span>
            <span className="text-xs">Drag & drop or click to browse</span>
          </div>
        )}
      </div>

      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {urls.map((url, i) => (
            <div key={url} className="relative group aspect-square rounded-md overflow-hidden border bg-muted">
              <Image
                src={url}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3 text-white" />
              </button>
              {isSingle && urls.length > 1 && (
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
