import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Newspaper, FolderOpen } from "lucide-react";
import { Loader2 } from "lucide-react";

function useCount(table: string) {
  return useQuery({
    queryKey: ["admin-count", table],
    queryFn: async () => {
      const { count, error } = await (supabase.from(table as any) as any)
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });
}

const stats = [
  { key: "books", label: "Livres", icon: BookOpen },
  { key: "authors", label: "Auteurs", icon: Users },
  { key: "news_articles", label: "Actualités", icon: Newspaper },
  { key: "collections", label: "Collections", icon: FolderOpen },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.key} table={s.key} label={s.label} icon={s.icon} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ table, label, icon: Icon }: { table: string; label: string; icon: React.ElementType }) {
  const { data: count, isLoading } = useCount(table);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <div className="text-2xl font-bold text-foreground">{count}</div>
        )}
      </CardContent>
    </Card>
  );
}
