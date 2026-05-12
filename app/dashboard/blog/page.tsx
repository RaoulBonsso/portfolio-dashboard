"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { BlogPost } from "@/types";
import { Plus, FileText, Calendar } from "lucide-react";

const initialPosts: BlogPost[] = [
  {
    id: "1",
    title: "Introduction à TypeScript",
    content: "TypeScript est un sur-ensemble de JavaScript qui ajoute des types statiques...",
    image: "",
    tags: ["TypeScript", "JavaScript"],
    status: "published",
    publishedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Les hooks React expliqués",
    content: "Les hooks sont une fonctionnalité introduite dans React 16.8...",
    image: "",
    tags: ["React", "Hooks"],
    status: "draft",
    publishedAt: "",
  },
];

export default function BlogPage() {
  const [posts, setPosts] = React.useState<BlogPost[]>(initialPosts);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);
  const [formData, setFormData] = React.useState<Partial<BlogPost>>({
    title: "",
    content: "",
    image: "",
    tags: [],
    status: "draft",
  });

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData(post);
    } else {
      setEditingPost(null);
      setFormData({ title: "", content: "", image: "", tags: [], status: "draft" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (editingPost) {
      setPosts((prev) =>
        prev.map((p) => (p.id === editingPost.id ? { ...p, ...formData } as BlogPost : p))
      );
      toast.success("Article mis à jour");
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: formData.title || "",
        content: formData.content || "",
        image: formData.image || "",
        tags: formData.tags || [],
        status: (formData.status as "published" | "draft") || "draft",
        publishedAt: formData.status === "published" ? new Date().toISOString().split("T")[0] : "",
      };
      setPosts((prev) => [...prev, newPost]);
      toast.success("Article ajouté");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (post: BlogPost) => {
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    toast.success("Article supprimé");
  };

  const columns = [
    {
      key: "title",
      header: "Titre",
      render: (post: BlogPost) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium">{post.title}</span>
        </div>
      ),
    },
    {
      key: "tags",
      header: "Tags",
      render: (post: BlogPost) => (
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (post: BlogPost) =>
        post.status === "published" ? (
          <Badge variant="success">Publié</Badge>
        ) : (
          <Badge variant="warning">Brouillon</Badge>
        ),
    },
    {
      key: "publishedAt",
      header: "Date",
      render: (post: BlogPost) =>
        post.publishedAt ? (
          <div className="flex items-center gap-1 text-muted">
            <Calendar className="h-3 w-3" />
            <span className="text-xs">{post.publishedAt}</span>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Blog</h2>
          <p className="text-muted">Gérez vos articles de blog</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? "Modifier l'article" : "Nouvel article"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Titre</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Contenu</label>
            <Textarea
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Tags (séparés par des virgules)
            </label>
            <Input
              value={formData.tags?.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(",").map((t) => t.trim()),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="flex h-10 w-full rounded-md border border-[rgba(100,255,218,0.1)] bg-background px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingPost ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
