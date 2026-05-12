"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { Skill } from "@/types";
import { useSkills, useStorage } from "@/hooks/useSupabase";
import { Plus, Wrench, Upload, Loader2 } from "lucide-react";

export default function SkillsPage() {
  const { data: skills, loading, error, insert, update, remove } = useSkills();
  const { uploadImage } = useStorage();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingSkill, setEditingSkill] = React.useState<Skill | null>(null);
  const [formData, setFormData] = React.useState<Partial<Skill>>({
    name: "",
    level: 50,
    category: "",
    icon: "",
  });
  const [uploadingIcon, setUploadingIcon] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData(skill);
    } else {
      setEditingSkill(null);
      setFormData({ name: "", level: 50, category: "", icon: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      if (editingSkill) {
        await update(editingSkill.id, formData);
        toast.success("Compétence mise à jour");
      } else {
        await insert({
          name: formData.name,
          level: formData.level || 50,
          category: formData.category,
          icon: formData.icon || "",
        });
        toast.success("Compétence ajoutée");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (skill: Skill) => {
    try {
      await remove(skill.id);
      toast.success("Compétence supprimée");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression");
    }
  };

  const columns = [
    {
      key: "name",
      header: "Nom",
      render: (skill: Skill) => (
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-primary" />
          <span className="font-medium">{skill.name}</span>
        </div>
      ),
    },
    { key: "category", header: "Catégorie" },
    {
      key: "level",
      header: "Niveau",
      render: (skill: Skill) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${skill.level}%` }}
            />
          </div>
          <span className="text-xs text-muted">{skill.level}%</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Compétences</h2>
          <p className="text-muted">Gérez vos compétences techniques</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {loading && <div className="text-muted">Chargement...</div>}
      {error && <div className="text-red-400">Erreur : {error}</div>}

      <div className="flex flex-wrap gap-2">
        {Array.from(new Set(skills.map((s) => s.category))).map((cat) => (
          <Badge key={cat} variant="secondary">
            {cat}
          </Badge>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={skills}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? "Modifier la compétence" : "Nouvelle compétence"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nom</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Catégorie</label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Icône</label>
            <div className="flex items-center gap-3">
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="URL de l'icône"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingIcon(true);
                  try {
                    const url = await uploadImage(file, `skill_${Date.now()}`);
                    setFormData((prev) => ({ ...prev, icon: url }));
                    toast.success("Icône uploadée !");
                  } catch (err: any) {
                    toast.error(err.message || "Erreur upload");
                  } finally {
                    setUploadingIcon(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }
                }}
              />
              <Button
                variant="secondary"
                type="button"
                size="icon"
                disabled={uploadingIcon}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingIcon ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
            </div>
            {formData.icon && (
              <img src={formData.icon} alt="Preview" className="h-10 w-10 object-contain rounded border border-[rgba(100,255,218,0.1)]" />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Niveau ({formData.level}%)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingSkill ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
