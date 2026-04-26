import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Filter, RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSidebarProps {
  collections: FilterOption[];
  genres: FilterOption[];
  subGenres: FilterOption[];
  authors: FilterOption[];
  selectedCollection: string;
  selectedGenre: string;
  selectedSubGenre: string;
  selectedAuthor: string;
  onCollectionChange: (v: string) => void;
  onGenreChange: (v: string) => void;
  onSubGenreChange: (v: string) => void;
  onAuthorChange: (v: string) => void;
  onReset: () => void;
  resultCount: number;
  className?: string;
}

const FilterSelect: React.FC<{
  label: string;
  placeholder: string;
  options: FilterOption[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}> = ({ label, placeholder, options, value, onChange, disabled }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-foreground">{label}</label>
    <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  collections, genres, subGenres, authors,
  selectedCollection, selectedGenre, selectedSubGenre, selectedAuthor,
  onCollectionChange, onGenreChange, onSubGenreChange, onAuthorChange,
  onReset, resultCount, className,
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const hasActiveFilter = selectedCollection || selectedGenre || selectedSubGenre || selectedAuthor;

  const filtersContent = (
    <div className="space-y-4">
      <FilterSelect label={t.books.filterCollection} placeholder={t.books.allCollections} options={collections} value={selectedCollection} onChange={onCollectionChange} />
      <FilterSelect label={t.books.filterGenre} placeholder={t.books.allGenres} options={genres} value={selectedGenre} onChange={onGenreChange} />
      <FilterSelect label={t.books.filterSubGenre} placeholder={t.books.allSubGenres} options={subGenres} value={selectedSubGenre} onChange={onSubGenreChange} disabled={!selectedGenre} />
      <FilterSelect label={t.books.filterAuthor} placeholder={t.books.allAuthors} options={authors} value={selectedAuthor} onChange={onAuthorChange} />

      {hasActiveFilter && (
        <Button variant="ghost" size="sm" className="w-full mt-2" onClick={onReset}>
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          {t.books.resetFilters}
        </Button>
      )}

      <p className="text-sm text-muted-foreground pt-2 border-t border-border">
        {resultCount} {t.books.resultsCount}
      </p>
    </div>
  );

  if (isMobile) {
    return (
      <Collapsible className={cn("mb-6", className)}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {t.books.filters}
            </span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          {filtersContent}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <aside className={cn("w-64 shrink-0 space-y-2", className)}>
      <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4" />
        {t.books.filters}
      </h3>
      {filtersContent}
    </aside>
  );
};

export default FilterSidebar;
