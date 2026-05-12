"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";
import { Profile } from "@/types";
import { Code, Link, Globe, MessageCircle, Save, Upload } from "lucide-react";

const initialProfile: Profile = {
  id: "1",
  name: "John Doe",
  title: "Développeur Full Stack",
  bio: "Passionné par le développement web et les nouvelles technologies. Je crée des applications modernes et performantes.",
  photo: "",
  email: "john@example.com",
  phone: "+33 6 12 34 56 78",
  location: "Paris, France",
  socials: {
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    twitter: "https://twitter.com/johndoe",
    website: "https://johndoe.dev",
  },
};

export default function ProfilePage() {
  const [profile, setProfile] = React.useState<Profile>(initialProfile);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field: keyof Profile["socials"], value: string) => {
    setProfile((prev) => ({
      ...prev,
      socials: { ...prev.socials, [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Profil mis à jour avec succès !");
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Mon Profil</h2>
        <p className="text-muted">Gérez vos informations personnelles</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-light border border-[rgba(100,255,218,0.1)]">
                {profile.photo ? (
                  <img src={profile.photo} alt="Profile" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <Upload className="h-8 w-8 text-muted" />
                )}
              </div>
              <Button variant="secondary" type="button">
                <Upload className="mr-2 h-4 w-4" />
                Changer la photo
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nom complet</label>
                <Input value={profile.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Titre</label>
                <Input value={profile.title} onChange={(e) => handleChange("title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input type="email" value={profile.email} onChange={(e) => handleChange("email", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Téléphone</label>
                <Input value={profile.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Localisation</label>
              <Input value={profile.location} onChange={(e) => handleChange("location", e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bio</label>
              <Textarea rows={4} value={profile.bio} onChange={(e) => handleChange("bio", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réseaux sociaux</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Code className="h-4 w-4 text-muted" /> GitHub
              </label>
              <Input value={profile.socials.github} onChange={(e) => handleSocialChange("github", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Link className="h-4 w-4 text-muted" /> LinkedIn
              </label>
              <Input value={profile.socials.linkedin} onChange={(e) => handleSocialChange("linkedin", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <MessageCircle className="h-4 w-4 text-muted" /> Twitter
              </label>
              <Input value={profile.socials.twitter} onChange={(e) => handleSocialChange("twitter", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Globe className="h-4 w-4 text-muted" /> Site web
              </label>
              <Input value={profile.socials.website} onChange={(e) => handleSocialChange("website", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </div>
  );
}
