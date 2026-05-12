"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { Project } from "@/types";
import { useProjects, useStorage } from "@/hooks/useSupabase";
import { Plus, ExternalLink, Code, Upload, Loader2 } from "lucide-react";

export default function ProjectsPage() {
  const { data: projects, loading, error, insert, update, remove } = useProjects();
  const { uploadImage } = useStorage();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [formData, setFormData] = React.useState<Partial<Project>>({
    title: "",
    description: "",
    technologies: [],
    links: { demo: "", repo: "" },
    featured: false,
  });
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({ title: "", description: "", technologies: [], links: { demo: "", repo: "" }, featured: false });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      if (editingProject) {
        await update(editingProject.id, formData);
        toast.success("Projet mis à jour");
      } else {
        await insert({
          title: formData.title || "",
          description: formData.description || "",
          images: [],
          links: {
            demo: formData.links?.demo || "",
            repo: formData.links?.repo || "",
          },
          technologies: formData.technologies || [],
          featured: formData.featured || false,
        });
        toast.success("Projet ajouté");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (project: Project) => {
    try {
      await remove(project.id);
      toast.success("Projet supprimé");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression");
    }
  };

  const columns = [
    { key: "title", header: "Titre" },
    {
      key: "technologies",
      header: "Technologies",
      render: (project: Project) => (
        <div className="flex flex-wrap gap-1">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "featured",
      header: "Mis en avant",
      render: (project: Project) =>
        project.featured ? (
          <Badge variant="success">Oui</Badge>
        ) : (
          <Badge variant="muted">Non</Badge>
        ),
    },
    {
      key: "links",
      header: "Liens",
      render: (project: Project) => (
        <div className="flex gap-2">
          {project.links.demo && (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 text-primary hover:text-primary-dark" />
            </a>
          )}
          {project.links.repo && (
            <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
              <Code className="h-4 w-4 text-muted hover:text-foreground" />
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Projets</h2>
          <p className="text-muted">Gérez vos projets portfolio</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {loading && <div className="text-muted">Chargement...</div>}
      {error && <div className="text-red-400">Erreur : {error}</div>}

      <DataTable
        columns={columns}
        data={projects}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Modifier le projet" : "Nouveau projet"}
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
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Image</label>
            <div className="flex items-center gap-3">
              <Input
                value={formData.images?.[0] || ""}
                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                placeholder="URL de l'image"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingImage(true);
                  try {
                    const url = await uploadImage(file, `project_${Date.now()}`);
                    setFormData((prev) => ({ ...prev, images: [url] }));
                    toast.success("Image uploadée !");
                  } catch (err: any) {
                    toast.error(err.message || "Erreur upload");
                  } finally {
                    setUploadingImage(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }
                }}
              />
              <Button
                variant="secondary"
                type="button"
                size="icon"
                disabled={uploadingImage}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
            </div>
            {formData.images?.[0] && (
              <img src={formData.images[0]} alt="Preview" className="h-20 w-20 object-cover rounded border border-[rgba(100,255,218,0.1)]" />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Technologies (séparées par des virgules)
            </label>
            <Input
              value={formData.technologies?.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  technologies: e.target.value.split(",").map((t) => t.trim()),
                })
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Démo</label>
              <Input
                value={formData.links?.demo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, demo: e.target.value } as Project['links'],
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Repo</label>
              <Input
                value={formData.links?.repo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, repo: e.target.value } as Project['links'],
                  })
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
            <label htmlFor="featured" className="text-sm text-foreground">
              Projet mis en avant
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingProject ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
