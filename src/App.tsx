import React, { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Lazy-loaded public pages
const Index = React.lazy(() => import("./pages/Index"));
const Actualites = React.lazy(() => import("./pages/Actualites"));
const ActualiteDetail = React.lazy(() => import("./pages/ActualiteDetail"));
const Livres = React.lazy(() => import("./pages/Livres"));
const BookDetail = React.lazy(() => import("./pages/BookDetail"));
const Collections = React.lazy(() => import("./pages/Collections"));
const OuNousTrouver = React.lazy(() => import("./pages/OuNousTrouver"));
const QuiSommesNous = React.lazy(() => import("./pages/QuiSommesNous"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Distributeurs = React.lazy(() => import("./pages/Distributeurs"));
const Auteurs = React.lazy(() => import("./pages/Auteurs"));
const AuteurDetail = React.lazy(() => import("./pages/AuteurDetail"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Lazy-loaded admin pages
const AdminLogin = React.lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBooks = React.lazy(() => import("./pages/admin/AdminBooks"));
const AdminAuthors = React.lazy(() => import("./pages/admin/AdminAuthors"));
const AdminNews = React.lazy(() => import("./pages/admin/AdminNews"));
const AdminCollections = React.lazy(() => import("./pages/admin/AdminCollections"));
const AdminDistributors = React.lazy(() => import("./pages/admin/AdminDistributors"));

const AdminTeam = React.lazy(() => import("./pages/admin/AdminTeam"));
const AdminSetup = React.lazy(() => import("./pages/admin/AdminSetup"));

// These are small layout/guard components — keep eager
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminErrorBoundary from "./components/admin/AdminErrorBoundary";

// Warm-up ping to wake Supabase from cold start
function SupabaseWarmUp() {
  useEffect(() => {
    supabase.from("genres").select("id").limit(1).then(() => {});
  }, []);
  return null;
}

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
      <SupabaseWarmUp />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
              {/* Public site */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/actualites" element={<Layout><Actualites /></Layout>} />
              <Route path="/actualites/:id" element={<Layout><ActualiteDetail /></Layout>} />
              <Route path="/livres" element={<Layout><Livres /></Layout>} />
              <Route path="/livres/:id" element={<Layout><BookDetail /></Layout>} />
              <Route path="/collections" element={<Layout><Collections /></Layout>} />
              <Route path="/auteurs" element={<Layout><Auteurs /></Layout>} />
              <Route path="/auteurs/:id" element={<Layout><AuteurDetail /></Layout>} />
              <Route path="/ou-nous-trouver" element={<Layout><OuNousTrouver /></Layout>} />
              <Route path="/qui-sommes-nous" element={<Layout><QuiSommesNous /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/distributeurs" element={<Layout><Distributeurs /></Layout>} />

              {/* Admin */}
              <Route path="/apic-admin">
                <Route index element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
                <Route path="setup" element={<Suspense fallback={<PageLoader />}><AdminSetup /></Suspense>} />
                <Route element={<ProtectedRoute><AdminErrorBoundary><AdminLayout /></AdminErrorBoundary></ProtectedRoute>}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="livres" element={<AdminBooks />} />
                  <Route path="auteurs" element={<AdminAuthors />} />
                  <Route path="actualites" element={<AdminNews />} />
                  <Route path="collections" element={<AdminCollections />} />
                  <Route path="distributeurs" element={<AdminDistributors />} />
                  <Route path="equipe" element={<AdminTeam />} />
                </Route>
              </Route>

              <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
