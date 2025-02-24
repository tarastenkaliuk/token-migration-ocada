"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center rounded-full box-border border-0 outline-none",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-full w-full grow overflow-hidden rounded-full bg-[#97AEF3] box-border outline-none p-0 ring-0">
      <SliderPrimitive.Range className="absolute h-full bg-[#2E364C] left-0 rounded-none" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-0 border-primary bg-background transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
