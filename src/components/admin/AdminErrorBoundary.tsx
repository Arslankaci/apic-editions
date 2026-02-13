import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface State {
  hasError: boolean;
  error?: Error;
}

export default class AdminErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-background text-foreground p-6">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h1 className="text-xl font-heading font-bold">Une erreur est survenue</h1>
          <p className="text-sm text-muted-foreground max-w-md text-center">
            {this.state.error?.message || "Erreur inattendue dans l'interface d'administration."}
          </p>
          <Button onClick={() => window.location.reload()}>Recharger la page</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
