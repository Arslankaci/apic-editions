import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import CustomBadge from "./CustomBadge";
import { Trophy } from "lucide-react";

export interface BookCardBook {
  id: string;
  title: string;
  cover: string | null;
  is_new: boolean | null;
  author_id: string | null;
  authors?: { first_name: string | null; last_name: string } | null;
  awards?: { name: string }[] | null;
  price?: number | null;
  currency?: string | null;
}

export interface BookCardProps {
  book: BookCardBook;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({ book, className }) => (
  <Link to={`/livres/${book.id}`} className={cn("group", className)}>
    <div className="relative overflow-hidden rounded-lg shadow-md mb-3 aspect-[3/4]">
      <img
        src={book.cover || "/placeholder.svg"}
        alt={book.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      {book.is_new && (
        <CustomBadge variant="primary" className="absolute top-2 right-2">
          NEW
        </CustomBadge>
      )}
      {book.awards && book.awards.length > 0 && (
        <div className="absolute bottom-2 left-2 bg-yellow-500/90 text-white rounded-full p-1.5 shadow" title={book.awards[0].name}>
          <Trophy className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
    <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
      {book.title}
    </h3>
    {book.authors && (
      <Link
        to={`/auteurs/${book.author_id}`}
        className="text-xs text-muted-foreground mt-1 hover:text-primary transition-colors block"
        onClick={(e) => e.stopPropagation()}
      >
        {[book.authors?.first_name, book.authors?.last_name].filter(Boolean).join(" ")}
      </Link>
    )}
    {book.price != null && (
      <span className="text-xs font-medium text-primary mt-1 block">
        {book.price.toFixed(2)} {book.currency || "EUR"}
      </span>
    )}
  </Link>
);

export default BookCard;
