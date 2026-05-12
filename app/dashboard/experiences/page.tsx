"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { Experience } from "@/types";
import { Plus, Calendar, MapPin } from "lucide-react";

const initialExperiences: Experience[] = [
  {
    id: "1",
    company: "Tech Corp",
    position: "Senior Developer",
    startDate: "2022-01",
    endDate: "Présent",
    description: "Développement d'applications web en React et Node.js",
    location: "Paris",
  },
  {
    id: "2",
    company: "StartupXYZ",
    position: "Full Stack Developer",
    startDate: "2020-06",
    endDate: "2021-12",
    description: "Création d'une plateforme SaaS de gestion de projet",
    location: "Lyon",
  },
];

export default function ExperiencesPage() {
  const [experiences, setExperiences] = React.useState<Experience[]>(initialExperiences);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingExperience, setEditingExperience] = React.useState<Experience | null>(null);
  const [formData, setFormData] = React.useState<Partial<Experience>>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    location: "",
  });

  const handleOpenModal = (exp?: Experience) => {
    if (exp) {
      setEditingExperience(exp);
      setFormData(exp);
    } else {
      setEditingExperience(null);
      setFormData({ company: "", position: "", startDate: "", endDate: "", description: "", location: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.company || !formData.position) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (editingExperience) {
      setExperiences((prev) =>
        prev.map((e) => (e.id === editingExperience.id ? { ...e, ...formData } as Experience : e))
      );
      toast.success("Expérience mise à jour");
    } else {
      const newExp: Experience = {
        id: Date.now().toString(),
        company: formData.company || "",
        position: formData.position || "",
        startDate: formData.startDate || "",
        endDate: formData.endDate || "",
        description: formData.description || "",
        location: formData.location || "",
      };
      setExperiences((prev) => [...prev, newExp]);
      toast.success("Expérience ajoutée");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (exp: Experience) => {
    setExperiences((prev) => prev.filter((e) => e.id !== exp.id));
    toast.success("Expérience supprimée");
  };

  const columns = [
    { key: "company", header: "Entreprise" },
    { key: "position", header: "Poste" },
    {
      key: "dates",
      header: "Période",
      render: (exp: Experience) => (
        <div className="flex items-center gap-1 text-muted">
          <Calendar className="h-3 w-3" />
          <span className="text-xs">
            {exp.startDate} - {exp.endDate}
          </span>
        </div>
      ),
    },
    {
      key: "location",
      header: "Lieu",
      render: (exp: Experience) => (
        <div className="flex items-center gap-1 text-muted">
          <MapPin className="h-3 w-3" />
          <span className="text-xs">{exp.location}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Expériences</h2>
          <p className="text-muted">Gérez vos expériences professionnelles</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={experiences}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExperience ? "Modifier l'expérience" : "Nouvelle expérience"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Entreprise</label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Poste</label>
            <Input
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date début</label>
              <Input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date fin</label>
              <Input
                value={formData.endDate}
                placeholder="Présent"
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Lieu</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingExperience ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
