import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import CustomBadge from "./CustomBadge";

export interface BookCardBook {
  id: string;
  title: string;
  cover: string | null;
  is_new: boolean | null;
  author_id: string | null;
  authors?: { first_name: string | null; last_name: string } | null;
  book_authors?: { author_id: string; authors: { id: string; first_name: string | null; last_name: string } }[] | null;
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
    </div>
    <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
      {book.title}
    </h3>
    {(() => {
      const ba = book.book_authors?.[0];
      const authorName = ba
        ? [ba.authors.first_name, ba.authors.last_name].filter(Boolean).join(" ")
        : book.authors
          ? [book.authors.first_name, book.authors.last_name].filter(Boolean).join(" ")
          : null;
      const authorId = ba?.author_id || book.author_id;
      if (!authorName) return null;
      return (
        <Link
          to={`/auteurs/${authorId}`}
          className="text-xs text-muted-foreground mt-1 hover:text-primary transition-colors block"
          onClick={(e) => e.stopPropagation()}
        >
          {authorName}
        </Link>
      );
    })()}
    {book.price != null && (
      <span className="text-xs font-medium text-primary mt-1 block">
        {book.price.toFixed(2)} {book.currency || "EUR"}
      </span>
    )}
  </Link>
);

export default BookCard;
