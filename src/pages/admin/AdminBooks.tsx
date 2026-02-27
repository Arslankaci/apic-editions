import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/admin/ImageUpload";

type Book = Tables<"books"> & {
  book_authors?: { author_id: string; authors: { first_name: string | null; last_name: string } }[];
  collections: { name: string } | null;
  
};

const emptyForm = {
  title: "", description: "", isbn: "", pages: "", published_date: "",
  genre: "", sub_genre: "", cover: "", back_cover: "", collection_id: "", is_new: false,
  author_ids: [] as string[],
  currency: "EUR", price: "",
};

export default function AdminBooks() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*, book_authors(author_id, authors(first_name, last_name)), collections(name)")
        .order("title");
      if (error) throw error;
      return data as Book[];
    },
  });

  const { data: authors = [] } = useQuery({
    queryKey: ["admin-authors-select"],
    queryFn: async () => {
      const { data, error } = await supabase.from("authors").select("id, first_name, last_name").order("last_name");
      if (error) throw error;
      return data;
    },
  });

  const { data: collections = [] } = useQuery({
    queryKey: ["admin-collections-select"],
    queryFn: async () => {
      const { data, error } = await supabase.from("collections").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: genres = [] } = useQuery({
    queryKey: ["admin-genres-select"],
    queryFn: async () => {
      const { data, error } = await supabase.from("genres").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: subGenres = [] } = useQuery({
    queryKey: ["admin-sub-genres-select"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sub_genres").select("id, name, genre_id").order("name");
      if (error) throw error;
      return data;
    },
  });


  const upsert = useMutation({
    mutationFn: async ({ bookData, authorIds }: { bookData: TablesInsert<"books">; authorIds: string[] }) => {
      let bookId: string;
      if (editing) {
        const { error } = await supabase.from("books").update(bookData).eq("id", editing.id);
        if (error) throw error;
        bookId = editing.id;
      } else {
        const { data, error } = await supabase.from("books").insert(bookData).select("id").single();
        if (error) throw error;
        bookId = data.id;
      }

      // Sync book_authors
      await supabase.from("book_authors").delete().eq("book_id", bookId);
      if (authorIds.length > 0) {
        const { error } = await supabase.from("book_authors").insert(
          authorIds.map((aid) => ({ book_id: bookId, author_id: aid }))
        );
        if (error) throw error;
      }

    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      setDialogOpen(false);
      toast.success(editing ? "Livre modifié" : "Livre ajouté");
    },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      setDeleteId(null);
      toast.success("Livre supprimé");
    },
    onError: (e) => toast.error(e.message),
  });

  const openNew = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (b: Book) => {
    setEditing(b);
    setForm({
      title: b.title, description: b.description ?? "", isbn: b.isbn ?? "",
      pages: b.pages?.toString() ?? "", published_date: b.published_date ?? "",
      genre: b.genre ?? "", sub_genre: b.sub_genre ?? "", cover: b.cover ?? "", back_cover: (b as any).back_cover ?? "",
      collection_id: b.collection_id ?? "", is_new: b.is_new ?? false,
      author_ids: b.book_authors?.map((ba) => ba.author_id) ?? [],
      currency: (b as any).currency ?? "EUR", price: (b as any).price?.toString() ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsert.mutate({
      bookData: {
        title: form.title,
        description: form.description || null,
        isbn: form.isbn || null,
        pages: form.pages ? parseInt(form.pages) : null,
        published_date: form.published_date || null,
        genre: form.genre || null,
        sub_genre: form.sub_genre || null,
        cover: form.cover || null,
        back_cover: form.back_cover || null,
        author_id: form.author_ids[0] || null,
        collection_id: form.collection_id || null,
        is_new: form.is_new,
        currency: form.currency || "EUR",
        price: form.price ? parseFloat(form.price) : null,
      } as any,
      authorIds: form.author_ids,
    });
  };

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));
  const toggleAuthor = (id: string) => setForm((f) => ({
    ...f, author_ids: f.author_ids.includes(id) ? f.author_ids.filter((a) => a !== id) : [...f.author_ids, id],
  }));

  const getAuthorNames = (b: Book) =>
    b.book_authors?.map((ba) => [ba.authors?.first_name, ba.authors?.last_name].filter(Boolean).join(" ")).filter(Boolean).join(", ") || "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Livres</h1>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" />Ajouter</Button>
      </div>

      {isLoading ? (
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Auteur(s)</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Nouveau</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-36 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-12 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Auteur(s)</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Nouveau</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{b.title}</TableCell>
                  <TableCell>{getAuthorNames(b)}</TableCell>
                  <TableCell>{b.genre ?? "—"}</TableCell>
                  <TableCell>{b.collections?.name ?? "—"}</TableCell>
                  <TableCell>{b.is_new ? <Badge>Nouveau</Badge> : "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Modifier le livre" : "Nouveau livre"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Titre *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>

            {/* Multi-select auteurs */}
            <div>
              <Label>Auteur(s)</Label>
              <div className="border rounded-md p-2 max-h-32 overflow-y-auto space-y-1 mt-1">
                {authors.map((a) => (
                  <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5">
                    <Checkbox checked={form.author_ids.includes(a.id)} onCheckedChange={() => toggleAuthor(a.id)} />
                    {[a.first_name, a.last_name].filter(Boolean).join(" ")}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Collection</Label>
              <Select value={form.collection_id} onValueChange={(v) => set("collection_id", v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>{collections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sous-genre</Label>
                <Select
                  value={form.sub_genre}
                  onValueChange={(v) => {
                    set("sub_genre", v);
                    const sg = subGenres.find((s) => s.name === v);
                    if (sg) {
                      const parentGenre = genres.find((g) => g.id === sg.genre_id);
                      if (parentGenre) set("genre", parentGenre.name);
                    }
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => {
                      const groupSubs = subGenres.filter((sg) => sg.genre_id === g.id);
                      if (groupSubs.length === 0) return null;
                      return (
                        <SelectGroup key={g.id}>
                          <SelectLabel>{g.name}</SelectLabel>
                          {groupSubs.map((sg) => (
                            <SelectItem key={sg.id} value={sg.name}>{sg.name}</SelectItem>
                          ))}
                        </SelectGroup>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Genre (auto)</Label>
                <Input value={form.genre} readOnly disabled className="bg-muted" placeholder="Déduit du sous-genre" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div><Label>ISBN</Label><Input value={form.isbn} onChange={(e) => set("isbn", e.target.value)} /></div>
              <div><Label>Pages</Label><Input type="number" value={form.pages} onChange={(e) => set("pages", e.target.value)} /></div>
              <div><Label>Date pub.</Label><Input type="date" value={form.published_date} onChange={(e) => set("published_date", e.target.value)} /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><Label>Couverture</Label><ImageUpload bucket="book-covers" value={form.cover} onChange={(url) => set("cover", url)} /></div>
              <div><Label>4ème de couverture (résumé)</Label><Textarea value={form.back_cover} onChange={(e) => set("back_cover", e.target.value)} rows={4} placeholder="Entrez le résumé / texte de la 4ème de couverture" /></div>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} /></div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Devise</Label>
                <Select value={form.currency} onValueChange={(v) => set("currency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="DA">DA (د.ج)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prix</Label>
                <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder={form.currency === "EUR" ? "0.00 €" : "0.00 د.ج"} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={form.is_new} onCheckedChange={(v) => set("is_new", v)} />
              <Label>Marquer comme nouveau</Label>
            </div>

            <Button type="submit" disabled={upsert.isPending} className="w-full">
              {upsert.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              {editing ? "Modifier" : "Ajouter"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}