"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { generateBlurPlaceholder } from "@/lib/utils/blur-placeholder";

export interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [zoom, setZoom] = React.useState(false);
  const [origin, setOrigin] = React.useState("50% 50%");

  if (images.length === 0) return null;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 lg:gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActiveIdx(i)}
            aria-label={`View image ${i + 1}`}
            aria-current={i === activeIdx}
            className={cn(
              "relative aspect-[3/4] overflow-hidden rounded-md bg-muted/5 border-2 transition-colors",
              i === activeIdx
                ? "border-foreground"
                : "border-transparent hover:border-border"
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted/5 cursor-zoom-in"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
      >
        <Image
          src={images[activeIdx]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          placeholder="blur"
          blurDataURL={generateBlurPlaceholder()}
          className={cn(
            "object-cover transition-transform duration-300",
            zoom && "scale-150"
          )}
          style={{ transformOrigin: origin }}
        />
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-card/80 backdrop-blur px-2.5 py-1 text-xs rounded-full price-mono">
            {activeIdx + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
