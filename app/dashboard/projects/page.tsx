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
import { Plus, ExternalLink, Code } from "lucide-react";

const initialProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "Plateforme e-commerce complète avec panier et paiement",
    images: [],
    links: { demo: "https://demo.com", repo: "https://github.com" },
    technologies: ["React", "Node.js", "PostgreSQL"],
    featured: true,
  },
  {
    id: "2",
    title: "Task Manager",
    description: "Application de gestion de tâches collaborative",
    images: [],
    links: { demo: "https://demo.com", repo: "https://github.com" },
    technologies: ["Next.js", "TypeScript", "Prisma"],
    featured: false,
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [formData, setFormData] = React.useState<Partial<Project>>({
    title: "",
    description: "",
    technologies: [],
    links: { demo: "", repo: "" },
    featured: false,
  });

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

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? { ...p, ...formData } as Project : p))
      );
      toast.success("Projet mis à jour");
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        title: formData.title || "",
        description: formData.description || "",
        images: [],
        technologies: formData.technologies || [],
        links: formData.links || { demo: "", repo: "" },
        featured: formData.featured || false,
      };
      setProjects((prev) => [...prev, newProject]);
      toast.success("Projet ajouté");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (project: Project) => {
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    toast.success("Projet supprimé");
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
