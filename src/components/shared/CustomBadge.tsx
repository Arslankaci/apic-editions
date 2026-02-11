import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-block px-2 py-0.5 text-xs font-semibold rounded",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        outline: "border border-border text-foreground",
        accent: "bg-primary/10 text-primary rounded-full",
      },
    },
    defaultVariants: { variant: "primary" },
  }
);

export interface CustomBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const CustomBadge: React.FC<CustomBadgeProps> = ({
  variant,
  className,
  ...props
}) => <span className={cn(badgeVariants({ variant }), className)} {...props} />;

export default CustomBadge;
