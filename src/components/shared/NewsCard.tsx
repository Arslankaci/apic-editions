import React from "react";
import { Link } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import CustomBadge from "./CustomBadge";

const newsCardVariants = cva("overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer", {
  variants: {
    variant: {
      compact: "",
      horizontal: "",
    },
  },
  defaultVariants: { variant: "compact" },
});

export interface NewsCardArticle {
  id: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  date: string | null;
  category: string | null;
}

export interface NewsCardProps extends VariantProps<typeof newsCardVariants> {
  article: NewsCardArticle;
  badgeLabel?: string;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  variant = "compact",
  badgeLabel,
  className,
}) => {
  if (variant === "horizontal") {
    return (
      <Link to={`/actualites/${article.id}`}>
        <Card className={cn(newsCardVariants({ variant }), className)}>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-72 aspect-video md:aspect-auto overflow-hidden">
              <img
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <CardContent className="p-6 flex-1">
              <div className="flex items-center gap-3 mb-2">
                {badgeLabel && <CustomBadge variant="primary">{badgeLabel}</CustomBadge>}
                <span className="text-sm text-muted-foreground">{article.date}</span>
                {article.category && <span className="text-sm text-muted-foreground">• {article.category}</span>}
              </div>
              <h2 className="text-xl font-heading font-semibold mb-2">{article.title}</h2>
              <p className="text-muted-foreground">{article.excerpt}</p>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/actualites/${article.id}`}>
      <Card className={cn(newsCardVariants({ variant }), className)}>
        <div className="aspect-video overflow-hidden">
          <img
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <CardContent className="p-5">
          <CustomBadge variant="accent" className="mb-2">
            {article.category}
          </CustomBadge>
          <h3 className="font-heading font-semibold mb-2 leading-tight">{article.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
          <p className="text-xs text-muted-foreground mt-3">{article.date}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;
