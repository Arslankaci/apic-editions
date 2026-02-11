import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  title,
  description,
  iconClassName,
  className,
}) => (
  <Card className={cn(className)}>
    <CardContent className="p-5 flex items-start gap-3">
      <Icon className={cn("w-5 h-5 mt-0.5 text-primary", iconClassName)} />
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

export default InfoCard;
