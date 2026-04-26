import { Suspense } from "react";
import AdminHeader from "./AdminHeader";
import { Loader2 } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Prefetch reference data so admin pages load instantly
function usePrefetchReferenceData() {
  useQuery({ queryKey: ["admin-authors-select"], queryFn: async () => { const { data } = await supabase.from("authors").select("id, first_name, last_name").order("last_name"); return data; }, staleTime: 5 * 60 * 1000 });
  useQuery({ queryKey: ["admin-collections-select"], queryFn: async () => { const { data } = await supabase.from("collections").select("id, name").order("name"); return data; }, staleTime: 5 * 60 * 1000 });
  useQuery({ queryKey: ["admin-genres-select"], queryFn: async () => { const { data } = await supabase.from("genres").select("id, name").order("name"); return data; }, staleTime: 5 * 60 * 1000 });
  useQuery({ queryKey: ["admin-sub-genres-select"], queryFn: async () => { const { data } = await supabase.from("sub_genres").select("id, name, genre_id").order("name"); return data; }, staleTime: 5 * 60 * 1000 });
}

export default function AdminLayout() {
  usePrefetchReferenceData();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader />
      <main className="flex-1 container py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[40vh]">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
