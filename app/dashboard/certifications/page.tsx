"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { Certification } from "@/types";
import { useCertifications } from "@/hooks/useSupabase";
import { Plus, Award, ExternalLink } from "lucide-react";

export default function CertificationsPage() {
  const { data: certifications, loading, error, insert, update, remove } = useCertifications();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCert, setEditingCert] = React.useState<Certification | null>(null);
  const [formData, setFormData] = React.useState<Partial<Certification>>({
    title: "",
    organization: "",
    date: "",
    status: "valid",
    url: "",
  });

  const handleOpenModal = (cert?: Certification) => {
    if (cert) {
      setEditingCert(cert);
      setFormData(cert);
    } else {
      setEditingCert(null);
      setFormData({ title: "", organization: "", date: "", status: "valid", url: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.organization) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      if (editingCert) {
        await update(editingCert.id, formData);
        toast.success("Certification mise à jour");
      } else {
        await insert({
          title: formData.title || "",
          organization: formData.organization || "",
          date: formData.date || "",
          status: (formData.status as "valid" | "expired" | "in-progress") || "valid",
          url: formData.url || "",
        });
        toast.success("Certification ajoutée");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (cert: Certification) => {
    try {
      await remove(cert.id);
      toast.success("Certification supprimée");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge variant="success">Valide</Badge>;
      case "expired":
        return <Badge variant="danger">Expirée</Badge>;
      case "in-progress":
        return <Badge variant="warning">En cours</Badge>;
      default:
        return <Badge variant="muted">{status}</Badge>;
    }
  };

  const columns = [
    {
      key: "title",
      header: "Titre",
      render: (cert: Certification) => (
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          <span className="font-medium">{cert.title}</span>
        </div>
      ),
    },
    { key: "organization", header: "Organisme" },
    { key: "date", header: "Date" },
    {
      key: "status",
      header: "Statut",
      render: (cert: Certification) => getStatusBadge(cert.status),
    },
    {
      key: "url",
      header: "Lien",
      render: (cert: Certification) =>
        cert.url ? (
          <a href={cert.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 text-primary hover:text-primary-dark" />
          </a>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Certifications</h2>
          <p className="text-muted">Gérez vos certifications et diplômes</p>
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
        data={certifications}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCert ? "Modifier la certification" : "Nouvelle certification"}
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
            <label className="text-sm font-medium text-foreground">Organisme</label>
            <Input
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date d&apos;obtention</label>
            <Input
              type="month"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="flex h-10 w-full rounded-md border border-[rgba(100,255,218,0.1)] bg-background px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
            >
              <option value="valid">Valide</option>
              <option value="expired">Expirée</option>
              <option value="in-progress">En cours</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">URL</label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingCert ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
