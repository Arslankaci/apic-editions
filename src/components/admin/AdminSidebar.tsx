import {
  LayoutDashboard,
  BookOpen,
  Users,
  Newspaper,
  FolderOpen,
  Award,
  Truck,
  UserCog,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { prefetchRoute } from "@/lib/routePrefetch";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/apic-admin/dashboard", icon: LayoutDashboard },
  { title: "Livres", url: "/apic-admin/livres", icon: BookOpen },
  { title: "Auteurs", url: "/apic-admin/auteurs", icon: Users },
  { title: "Événements", url: "/apic-admin/actualites", icon: Newspaper },
  { title: "Collections", url: "/apic-admin/collections", icon: FolderOpen },
  { title: "Catalogue", url: "/apic-admin/prix", icon: Award },
  { title: "Partenaires", url: "/apic-admin/distributeurs", icon: Truck },
  
  { title: "Équipe", url: "/apic-admin/equipe", icon: UserCog },
];

export default function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-heading text-sm">
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                      onMouseEnter={() => prefetchRoute(item.url)}
                      onFocus={() => prefetchRoute(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
