import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/admin/ImageUpload";

type News = Tables<"news_articles">;

const emptyForm = { title: "", excerpt: "", content: "", image: "", date: "", category: "", type: "actualite", event_type: "autre", extraImages: [] as string[] };
const categories = ["Événement", "Récompense", "Nouveauté", "Parution", "Autre"];
const types = [
  { value: "actualite", label: "Actualité" },
  { value: "evenement", label: "Événement" },
  { value: "historique", label: "Historique" },
];
const eventTypes = [
  { value: "autre", label: "— Aucun (actualité simple)" },
  { value: "salon", label: "Salon du livre" },
  { value: "rencontre", label: "Rencontre littéraire" },
  { value: "conference", label: "Conférence" },
  { value: "dedicace", label: "Séance dédicace" },
];

export default function AdminNews() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<News | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [newImageUrl, setNewImageUrl] = useState("");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news_articles").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async ({ articleData, extraImages, articleId }: { articleData: any; extraImages: string[]; articleId?: string }) => {
      let id: string;
      if (articleId) {
        const { error } = await supabase.from("news_articles").update(articleData).eq("id", articleId);
        if (error) throw error;
        id = articleId;
      } else {
        const { data, error } = await supabase.from("news_articles").insert(articleData).select("id").single();
        if (error) throw error;
        id = data.id;
      }

      // Sync extra images
      await supabase.from("news_images").delete().eq("news_article_id", id);
      if (extraImages.length > 0) {
        const { error } = await supabase.from("news_images").insert(
          extraImages.map((url, i) => ({ news_article_id: id, image_url: url, position: i }))
        );
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-news"] }); setDialogOpen(false); toast.success(editing ? "Article modifié" : "Article ajouté"); },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("news_articles").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-news"] }); setDeleteId(null); toast.success("Article supprimé"); },
    onError: (e) => toast.error(e.message),
  });

  const openNew = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = async (n: News) => {
    setEditing(n);
    // Load extra images
    const { data: images } = await supabase.from("news_images").select("image_url").eq("news_article_id", n.id).order("position");
    setForm({
      title: n.title, excerpt: n.excerpt ?? "", content: (n as any).content ?? "",
      image: n.image ?? "", date: n.date ?? "", category: n.category ?? "",
      type: (n as any).type ?? "actualite",
      event_type: (n as any).event_type ?? "autre",
      extraImages: images?.map((i) => i.image_url) ?? [],
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsert.mutate({
      articleData: {
        title: form.title, excerpt: form.excerpt || null, image: form.image || null,
        date: form.date || null, category: form.category || null,
        content: form.content || null, type: form.type || "actualite",
        event_type: form.event_type || "autre",
      },
      extraImages: form.extraImages,
      articleId: editing?.id,
    });
  };

  const addExtraImage = () => {
    if (newImageUrl.trim()) {
      setForm((f) => ({ ...f, extraImages: [...f.extraImages, newImageUrl.trim()] }));
      setNewImageUrl("");
    }
  };

  const removeExtraImage = (index: number) => {
    setForm((f) => ({ ...f, extraImages: f.extraImages.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Actualités</h1>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" />Ajouter</Button>
      </div>
      {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" /> : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>Titre</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Catégorie</TableHead><TableHead className="w-24">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {articles.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium max-w-[250px] truncate">{n.title}</TableCell>
                  <TableCell>{n.date ?? "—"}</TableCell>
                  <TableCell><Badge variant="outline">{types.find((t) => t.value === (n as any).type)?.label ?? "Actualité"}</Badge></TableCell>
                  <TableCell>{n.category ?? "—"}</TableCell>
                  <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(n)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => setDeleteId(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Modifier l'article" : "Nouvel article"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Titre *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{types.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Catégorie</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Image principale</Label><ImageUpload bucket="news-images" value={form.image} onChange={(url) => setForm({ ...form, image: url })} /></div>

            {/* Extra images */}
            <div>
              <Label>Images supplémentaires</Label>
              <div className="space-y-2 mt-1">
                {form.extraImages.map((url, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-border">
                    <img src={url} alt={`Image ${i + 1}`} className="w-full h-24 object-cover" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeExtraImage(i)}><X className="h-3 w-3" /></Button>
                  </div>
                ))}
              </div>
              <ImageUpload bucket="news-images" value="" onChange={(url) => setForm((f) => ({ ...f, extraImages: [...f.extraImages, url] }))} className="mt-2" />
            </div>

            <div><Label>Extrait</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} /></div>
            <div><Label>Contenu complet</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} /></div>
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