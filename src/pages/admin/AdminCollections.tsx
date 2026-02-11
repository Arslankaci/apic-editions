import { useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const COLOR_PALETTE = [
  { label: "Rouge", value: "#E53E3E" },
  { label: "Orange", value: "#DD6B20" },
  { label: "Jaune", value: "#D69E2E" },
  { label: "Vert", value: "#38A169" },
  { label: "Émeraude", value: "#0D9488" },
  { label: "Cyan", value: "#0891B2" },
  { label: "Bleu", value: "#3182CE" },
  { label: "Indigo", value: "#5A67D8" },
  { label: "Violet", value: "#805AD5" },
  { label: "Rose", value: "#D53F8C" },
  { label: "Gris", value: "#718096" },
  { label: "Noir", value: "#1A202C" },
];

type Collection = Tables<"collections">;
const emptyForm = { name: "", genre: "", sub_genre_id: "", description: "", color: "" };

export default function AdminCollections() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-collections"],
    queryFn: async () => { const { data, error } = await supabase.from("collections").select("*").order("name"); if (error) throw error; return data; },
  });

  const { data: genres = [] } = useQuery({
    queryKey: ["admin-genres-with-subs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("genres").select("id, name, sub_genres(id, name)").order("name");
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (values: any) => {
      if (editing) { const { error } = await supabase.from("collections").update(values).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("collections").insert(values); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-collections"] }); setDialogOpen(false); toast.success(editing ? "Collection modifiée" : "Collection ajoutée"); },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("collections").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-collections"] }); setDeleteId(null); toast.success("Collection supprimée"); },
    onError: (e) => toast.error(e.message),
  });

  const openNew = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (c: Collection) => {
    setEditing(c);
    setForm({ name: c.name, genre: c.genre ?? "", sub_genre_id: (c as any).sub_genre_id ?? "", description: c.description ?? "", color: c.color ?? "" });
    setDialogOpen(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsert.mutate({
      name: form.name, genre: form.genre || null, description: form.description || null,
      color: form.color || null, sub_genre_id: form.sub_genre_id || null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Collections</h1>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" />Ajouter</Button>
      </div>
      {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" /> : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Genre</TableHead><TableHead>Description</TableHead><TableHead className="w-24">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.genre ?? "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{c.description ?? "—"}</TableCell>
                  <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Modifier la collection" : "Nouvelle collection"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Nom *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div>
              <Label>Sous-genre</Label>
              <Select value={form.sub_genre_id} onValueChange={(v) => {
                const sg = genres.flatMap((g: any) => g.sub_genres?.map((s: any) => ({ ...s, genreName: g.name })) ?? []).find((s: any) => s.id === v);
                setForm({ ...form, sub_genre_id: v, genre: sg?.genreName ?? form.genre });
              }}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un sous-genre" /></SelectTrigger>
                <SelectContent>
                  {genres.map((g: any) => (
                    <SelectGroup key={g.id}>
                      <SelectLabel>{g.name}</SelectLabel>
                      {g.sub_genres?.map((sg: any) => (
                        <SelectItem key={sg.id} value={sg.id}>{sg.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Genre (auto-rempli)</Label><Input value={form.genre} readOnly className="bg-muted/50" /></div>
            <div>
              <Label>Couleur</Label>
              <div className="grid grid-cols-6 gap-2 mt-1">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => setForm({ ...form, color: c.value })}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                      form.color === c.value ? "border-foreground scale-110" : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: c.value }}
                  >
                    {form.color === c.value && <Check className="h-4 w-4 text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
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