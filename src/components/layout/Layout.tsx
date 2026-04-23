import React, { Suspense } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Loader2 } from "lucide-react";

const ContentFallback = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<ContentFallback />}>{children}</Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
