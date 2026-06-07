"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ColorSwatchProps {
  colors: { name: string; hex: string }[];
  value?: string;
  onChange: (color: string) => void;
}

export function ColorSwatch({ colors, value, onChange }: ColorSwatchProps) {
  if (colors.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">
          Color{value ? `: ${value}` : ""}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => {
          const active = value === c.name;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => onChange(c.name)}
              aria-pressed={active}
              aria-label={c.name}
              className={cn(
                "h-10 w-10 rounded-full border-2 transition-all",
                active
                  ? "border-foreground scale-110"
                  : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: c.hex }}
            />
          );
        })}
      </div>
    </div>
  );
}
