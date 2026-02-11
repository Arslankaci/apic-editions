import React from "react";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, Twitter, Mail, type LucideIcon } from "lucide-react";

interface SocialItem {
  icon: LucideIcon;
  href: string;
  label: string;
}

const defaultLinks: SocialItem[] = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Mail, href: "#", label: "Email" },
];

export interface SocialLinksProps {
  links?: SocialItem[];
  className?: string;
  linkClassName?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  links = defaultLinks,
  className,
  linkClassName,
}) => (
  <div className={cn("flex gap-3", className)}>
    {links.map((item) => (
      <a
        key={item.label}
        href={item.href}
        aria-label={item.label}
        className={cn(
          "p-2 rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/20 transition-colors",
          linkClassName
        )}
      >
        <item.icon className="w-4 h-4" />
      </a>
    ))}
  </div>
);

export default SocialLinks;
