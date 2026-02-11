import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Prefetch reference data so admin pages load instantly
function usePrefetchReferenceData() {
  useQuery({ queryKey: ["admin-authors-select"], queryFn: async () => { const { data } = await supabase.from("authors").select("id, name").order("name"); return data; }, staleTime: 5 * 60 * 1000 });
  useQuery({ queryKey: ["admin-collections-select"], queryFn: async () => { const { data } = await supabase.from("collections").select("id, name").order("name"); return data; }, staleTime: 5 * 60 * 1000 });
  useQuery({ queryKey: ["admin-genres-select"], queryFn: async () => { const { data } = await supabase.from("genres").select("id, name").order("name"); return data; }, staleTime: 5 * 60 * 1000 });
  useQuery({ queryKey: ["admin-sub-genres-select"], queryFn: async () => { const { data } = await supabase.from("sub_genres").select("id, name, genre_id").order("name"); return data; }, staleTime: 5 * 60 * 1000 });
  
}
export default function AdminLayout() {
  const { user, signOut } = useAuth();
  usePrefetchReferenceData();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center justify-between px-4 bg-background">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-heading text-lg text-foreground">APIC Admin</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Déconnexion
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 bg-muted/20">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
