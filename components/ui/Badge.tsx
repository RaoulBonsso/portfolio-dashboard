"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "border-[rgba(100,255,218,0.2)] bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "border-[rgba(59,130,246,0.2)] bg-accent/10 text-accent hover:bg-accent/20",
        success:
          "border-[rgba(34,197,94,0.2)] bg-green-500/10 text-green-400 hover:bg-green-500/20",
        warning:
          "border-[rgba(234,179,8,0.2)] bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20",
        danger:
          "border-[rgba(239,68,68,0.2)] bg-red-500/10 text-red-400 hover:bg-red-500/20",
        muted:
          "border-[rgba(136,146,176,0.2)] bg-muted/10 text-muted hover:bg-muted/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
