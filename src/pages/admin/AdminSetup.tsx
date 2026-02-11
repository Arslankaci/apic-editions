import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSetup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-admin", {
        method: "GET",
      });
      if (error) throw error;
      setAdminExists(data.adminExists);
    } catch {
      toast({ title: "Erreur", description: "Impossible de vérifier le statut.", variant: "destructive" });
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-admin", {
        body: { email, password },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({ title: "Succès", description: "Compte administrateur créé. Vous pouvez maintenant vous connecter." });
      navigate("/apic-admin");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {adminExists ? (
            <>
              <ShieldOff className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <CardTitle>Setup déjà effectué</CardTitle>
              <CardDescription>
                Un administrateur existe déjà. Cette page n'est plus accessible.
              </CardDescription>
            </>
          ) : (
            <>
              <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-2" />
              <CardTitle>Configuration initiale</CardTitle>
              <CardDescription>
                Créez le premier compte administrateur pour accéder au panel d'administration.
              </CardDescription>
            </>
          )}
        </CardHeader>

        {!adminExists && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@exemple.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer le compte admin
              </Button>
            </form>
          </CardContent>
        )}

        {adminExists && (
          <CardContent>
            <Button className="w-full" onClick={() => navigate("/apic-admin")}>
              Aller à la page de connexion
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
