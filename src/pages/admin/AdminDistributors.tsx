import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";

const emptyForm = { name: "", logo: "", website: "", street: "", street_complement: "", postal_code: "", city: "", country: "", description: "" };

export default function AdminDistributors() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-distributors"],
    queryFn: async () => { const { data, error } = await supabase.from("distributors").select("*").order("name"); if (error) throw error; return data; },
  });

  const upsert = useMutation({
    mutationFn: async (values: any) => {
      if (editing) { const { error } = await supabase.from("distributors").update(values).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("distributors").insert(values); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-distributors"] }); setDialogOpen(false); toast.success(editing ? "Distributeur modifié" : "Distributeur ajouté"); },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("distributors").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-distributors"] }); setDeleteId(null); toast.success("Distributeur supprimé"); },
    onError: (e: any) => toast.error(e.message),
  });

  const openNew = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (d: any) => {
    setEditing(d);
    setForm({
      name: d.name,
      logo: d.logo ?? "",
      website: d.website ?? "",
      street: d.street ?? "",
      street_complement: d.street_complement ?? "",
      postal_code: d.postal_code ?? "",
      city: d.city ?? "",
      country: d.country ?? "",
      description: d.description ?? "",
    });
    setDialogOpen(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsert.mutate({
      name: form.name,
      logo: form.logo || null,
      website: form.website || null,
      street: form.street || null,
      street_complement: form.street_complement || null,
      postal_code: form.postal_code || null,
      city: form.city || null,
      country: form.country || null,
      description: form.description || null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Distributeurs</h1>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" />Ajouter</Button>
      </div>
      {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" /> : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Ville</TableHead><TableHead>Site web</TableHead><TableHead className="w-24">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {items.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.city ?? "—"}</TableCell>
                  <TableCell>{d.website ? <a href={d.website} target="_blank" rel="noreferrer" className="text-primary underline">{d.website}</a> : "—"}</TableCell>
                  <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(d)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => setDeleteId(d.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Modifier le distributeur" : "Nouveau distributeur"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Nom *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <div><Label>Logo</Label><ImageUpload bucket="distributor-logos" value={form.logo} onChange={(url) => setForm({ ...form, logo: url })} /></div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Adresse</p>
              <div><Label>Rue</Label><Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} /></div>
              <div><Label>Complément d'adresse</Label><Input value={form.street_complement} onChange={(e) => setForm({ ...form, street_complement: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Code postal</Label><Input value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} /></div>
                <div><Label>Ville</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              </div>
              <div><Label>Pays</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            </div>
            <div><Label>Site web</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
            <Button type="submit" disabled={upsert.isPending} className="w-full">{upsert.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}{editing ? "Modifier" : "Ajouter"}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmer la suppression</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)}>Supprimer</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
