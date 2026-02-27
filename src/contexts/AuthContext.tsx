import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  adminCheckPending: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminCheckPending, setAdminCheckPending] = useState(false);
  const initialCheckDone = useRef(false);

  const checkAdminRole = useCallback(async (userId: string) => {
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
    return data === true;
  }, []);

  useEffect(() => {
    // Set up listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // Skip if getSession hasn't completed yet — it will handle the initial state
        if (!initialCheckDone.current) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setAdminCheckPending(true);
          const admin = await checkAdminRole(session.user.id);
          setIsAdmin(admin);
          setAdminCheckPending(false);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Then do the initial check
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.warn("Session recovery failed, signing out:", error.message);
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        initialCheckDone.current = true;
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const admin = await checkAdminRole(session.user.id);
        setIsAdmin(admin);
      }
      setLoading(false);
      initialCheckDone.current = true;
    });

    return () => subscription.unsubscribe();
  }, [checkAdminRole]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, adminCheckPending, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
