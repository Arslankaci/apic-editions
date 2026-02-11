import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "px-3 py-1.5 text-sm rounded-full border transition-colors cursor-pointer",
  {
    variants: {
      active: {
        true: "bg-primary text-primary-foreground border-primary",
        false: "border-border hover:bg-muted",
      },
    },
    defaultVariants: { active: false },
  }
);

export interface FilterChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof chipVariants> {}

const FilterChip: React.FC<FilterChipProps> = ({
  active,
  className,
  ...props
}) => (
  <button className={cn(chipVariants({ active: !!active }), className)} {...props} />
);

export default FilterChip;
