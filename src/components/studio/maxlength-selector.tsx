"use client";

import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { type SliderProps } from "@radix-ui/react-slider";

interface MaxLengthSelectorProps {
  value: number;
  setValue: (value: number) => void;
}

export function MaxLengthSelector({ value, setValue }: MaxLengthSelectorProps) {
  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxlength">Number of Images</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {value}
              </span>
            </div>
            <Slider
              id="maxlength"
              max={4}
              defaultValue={[value]}
              step={1}
              min={1}
              onValueChange={(num_ar) => setValue((num_ar[0] as number) ?? 1)}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Maximum Length"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          This value will determine the number of images the AI should generate.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
