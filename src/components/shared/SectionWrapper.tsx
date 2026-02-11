import React from "react";
import { cn } from "@/lib/utils";

export interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  bg?: string;
  as?: "section" | "div";
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className,
  bg,
  as: Tag = "section",
}) => (
  <Tag className={cn("py-16", bg)}>
    <div className={cn("container", className)}>{children}</div>
  </Tag>
);

export default SectionWrapper;
