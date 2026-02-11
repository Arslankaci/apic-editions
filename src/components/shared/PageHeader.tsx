import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, className }) => (
  <div className={cn("mb-8", className)}>
    <h1 className="text-4xl font-heading font-bold">{title}</h1>
    {subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
  </div>
);

export default PageHeader;
