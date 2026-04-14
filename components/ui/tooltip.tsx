"use client";

import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react";
import { cn } from "@/lib/utils";

// Base UI does not require a global provider by default, but we polyfill it for Shadcn API compatibility
const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const Tooltip = BaseTooltip.Root;

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Trigger> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return (
      <BaseTooltip.Trigger {...props} ref={ref as any} render={children as React.ReactElement} />
    );
  }
  return (
    <BaseTooltip.Trigger {...props} ref={ref as any}>
      {children}
    </BaseTooltip.Trigger>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof BaseTooltip.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup> & { sideOffset?: number }
>(({ className, sideOffset = 4, ...props }, ref) => (
  <BaseTooltip.Portal>
    <BaseTooltip.Positioner sideOffset={sideOffset}>
      <BaseTooltip.Popup
        ref={ref}
        className={cn(
          "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 shadow-md",
          className
        )}
        {...props}
      />
    </BaseTooltip.Positioner>
  </BaseTooltip.Portal>
));
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
