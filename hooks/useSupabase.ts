"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  Profile,
  Skill,
  Project,
  Experience,
  Certification,
  BlogPost,
  AnalyticsEvent,
} from "@/types";

function handleError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Une erreur inattendue s'est produite";
}

/* ===================== PROFILES ===================== */

function mapProfileFromDB(row: any): Profile {
  return {
    id: row.id,
    name: row.name || "",
    title: row.title || "",
    bio: row.bio || "",
    photo: row.photo_url || "",
    email: row.email || "",
    phone: row.phone || "",
    location: row.location || "",
    socials: {
      github: row.github || "",
      linkedin: row.linkedin || "",
      twitter: row.twitter || "",
      website: row.website || "",
    },
  };
}

function mapProfileToDB(item: Partial<Profile>): any {
  const payload: any = {};
  if (item.name !== undefined) payload.name = item.name;
  if (item.title !== undefined) payload.title = item.title;
  if (item.bio !== undefined) payload.bio = item.bio;
  if (item.email !== undefined) payload.email = item.email;
  if (item.phone !== undefined) payload.phone = item.phone;
  if (item.location !== undefined) payload.location = item.location;
  if (item.photo !== undefined) payload.photo_url = item.photo;
  if (item.socials?.github !== undefined) payload.github = item.socials.github;
  if (item.socials?.linkedin !== undefined) payload.linkedin = item.socials.linkedin;
  if (item.socials?.twitter !== undefined) payload.twitter = item.socials.twitter;
  if (item.socials?.website !== undefined) payload.website = item.socials.website;
  return payload;
}

export function useProfiles() {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: rows, error: err } = await supabase
        .from("profiles")
        .select("*");
      if (err) throw err;
      setData((rows || []).map(mapProfileFromDB));
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const insert = async (item: Omit<Profile, "id">) => {
    try {
      const payload = mapProfileToDB(item);
      const { error: err } = await supabase.from("profiles").insert(payload);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const update = async (id: string, item: Partial<Profile>) => {
    try {
      const payload = mapProfileToDB(item);
      const { error: err } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch, insert, update, remove };
}

/* ===================== SKILLS ===================== */

function mapSkillFromDB(row: any): Skill {
  return {
    id: row.id,
    name: row.name || "",
    level: row.level || 0,
    category: row.category || "",
    icon: row.icon || "",
  };
}

function mapSkillToDB(item: Partial<Skill>): any {
  const payload: any = {};
  if (item.name !== undefined) payload.name = item.name;
  if (item.level !== undefined) payload.level = item.level;
  if (item.category !== undefined) payload.category = item.category;
  if (item.icon !== undefined) payload.icon = item.icon;
  return payload;
}

export function useSkills() {
  const [data, setData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: rows, error: err } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true });
      if (err) throw err;
      setData((rows || []).map(mapSkillFromDB));
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const insert = async (item: Omit<Skill, "id">) => {
    try {
      const payload = mapSkillToDB(item);
      const { error: err } = await supabase.from("skills").insert(payload);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const update = async (id: string, item: Partial<Skill>) => {
    try {
      const payload = mapSkillToDB(item);
      const { error: err } = await supabase
        .from("skills")
        .update(payload)
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from("skills")
        .delete()
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch, insert, update, remove };
}

/* ===================== PROJECTS ===================== */

function mapProjectFromDB(row: any): Project {
  return {
    id: row.id,
    title: row.title || "",
    description: row.description || "",
    images: row.image_url ? [row.image_url] : [],
    links: {
      demo: row.demo_url || "",
      repo: row.code_url || "",
    },
    technologies: row.technologies || [],
    featured: row.status === "published",
  };
}

function mapProjectToDB(item: Partial<Project>): any {
  const payload: any = {};
  if (item.title !== undefined) payload.title = item.title;
  if (item.description !== undefined) payload.description = item.description;
  if (item.images !== undefined) payload.image_url = item.images[0] || "";
  if (item.links?.demo !== undefined) payload.demo_url = item.links.demo;
  if (item.links?.repo !== undefined) payload.code_url = item.links.repo;
  if (item.technologies !== undefined) payload.technologies = item.technologies;
  if (item.featured !== undefined) payload.status = item.featured ? "published" : "draft";
  return payload;
}

export function useProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: rows, error: err } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      if (err) throw err;
      setData((rows || []).map(mapProjectFromDB));
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const insert = async (item: Omit<Project, "id">) => {
    try {
      const payload = mapProjectToDB(item);
      const { error: err } = await supabase.from("projects").insert(payload);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const update = async (id: string, item: Partial<Project>) => {
    try {
      const payload = mapProjectToDB(item);
      const { error: err } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch, insert, update, remove };
}

/* ===================== EXPERIENCES ===================== */

function mapExperienceFromDB(row: any): Experience {
  return {
    id: row.id,
    company: row.company || "",
    position: row.role || "",
    startDate: row.start_date || "",
    endDate: row.end_date || "",
    description: row.description || "",
    location: row.location || "",
  };
}

function mapExperienceToDB(item: Partial<Experience>): any {
  const payload: any = {};
  if (item.company !== undefined) payload.company = item.company;
  if (item.position !== undefined) payload.role = item.position;
  if (item.startDate !== undefined) payload.start_date = item.startDate;
  if (item.endDate !== undefined) payload.end_date = item.endDate;
  if (item.description !== undefined) payload.description = item.description;
  if (item.location !== undefined) payload.location = item.location;
  return payload;
}

export function useExperiences() {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: rows, error: err } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });
      if (err) throw err;
      setData((rows || []).map(mapExperienceFromDB));
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const insert = async (item: Omit<Experience, "id">) => {
    try {
      const payload = mapExperienceToDB(item);
      const { error: err } = await supabase.from("experiences").insert(payload);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const update = async (id: string, item: Partial<Experience>) => {
    try {
      const payload = mapExperienceToDB(item);
      const { error: err } = await supabase
        .from("experiences")
        .update(payload)
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from("experiences")
        .delete()
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch, insert, update, remove };
}

/* ===================== CERTIFICATIONS ===================== */

function mapCertificationFromDB(row: any): Certification {
  return {
    id: row.id,
    title: row.title || "",
    organization: row.organization || "",
    date: row.date || "",
    status: row.status || "valid",
    url: row.url || "",
  };
}

function mapCertificationToDB(item: Partial<Certification>): any {
  const payload: any = {};
  if (item.title !== undefined) payload.title = item.title;
  if (item.organization !== undefined) payload.organization = item.organization;
  if (item.date !== undefined) payload.date = item.date;
  if (item.status !== undefined) payload.status = item.status;
  if (item.url !== undefined) payload.url = item.url;
  return payload;
}

export function useCertifications() {
  const [data, setData] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: rows, error: err } = await supabase
        .from("certifications")
        .select("*")
        .order("display_order", { ascending: true });
      if (err) throw err;
      setData((rows || []).map(mapCertificationFromDB));
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const insert = async (item: Omit<Certification, "id">) => {
    try {
      const payload = mapCertificationToDB(item);
      const { error: err } = await supabase.from("certifications").insert(payload);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const update = async (id: string, item: Partial<Certification>) => {
    try {
      const payload = mapCertificationToDB(item);
      const { error: err } = await supabase
        .from("certifications")
        .update(payload)
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from("certifications")
        .delete()
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch, insert, update, remove };
}

/* ===================== BLOG POSTS ===================== */

function mapBlogPostFromDB(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title || "",
    content: row.content || "",
    image: row.image_url || "",
    tags: row.tags || [],
    status: row.status || "draft",
    publishedAt: row.published_at || "",
  };
}

function mapBlogPostToDB(item: Partial<BlogPost>): any {
  const payload: any = {};
  if (item.title !== undefined) payload.title = item.title;
  if (item.content !== undefined) payload.content = item.content;
  if (item.image !== undefined) payload.image_url = item.image;
  if (item.tags !== undefined) payload.tags = item.tags;
  if (item.status !== undefined) payload.status = item.status;
  if (item.publishedAt !== undefined) payload.published_at = item.publishedAt;
  return payload;
}

export function useBlogPosts() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: rows, error: err } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (err) throw err;
      setData((rows || []).map(mapBlogPostFromDB));
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const insert = async (item: Omit<BlogPost, "id">) => {
    try {
      const payload = mapBlogPostToDB(item);
      const { error: err } = await supabase.from("blog_posts").insert(payload);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const update = async (id: string, item: Partial<BlogPost>) => {
    try {
      const payload = mapBlogPostToDB(item);
      const { error: err } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch, insert, update, remove };
}

/* ===================== ANALYTICS ===================== */

export function useAnalytics(startDate?: string, endDate?: string) {
  const [data, setData] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("analytics_events")
        .select("*")
        .order("created_at", { ascending: false });
      if (startDate) query = query.gte("created_at", startDate);
      if (endDate) query = query.lte("created_at", endDate);
      const { data: rows, error: err } = await query;
      if (err) throw err;
      setData(rows || []);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  const insert = async (item: Omit<AnalyticsEvent, "id">) => {
    try {
      const { error: err } = await supabase.from("analytics_events").insert(item);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const update = async (id: string, item: Partial<AnalyticsEvent>) => {
    try {
      const { error: err } = await supabase
        .from("analytics_events")
        .update(item)
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from("analytics_events")
        .delete()
        .eq("id", id);
      if (err) throw err;
      await fetch();
    } catch (err) {
      throw handleError(err);
    }
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch, insert, update, remove };
}

/* ===================== STORAGE ===================== */

export function useStorage() {
  const uploadImage = async (file: File, path?: string): Promise<string> => {
    const filePath = path || `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from("portfolio-media")
      .upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage
      .from("portfolio-media")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const deleteImage = async (url: string): Promise<void> => {
    const parts = url.split("/portfolio-media/");
    const path = parts[1];
    if (!path) throw new Error("URL d'image invalide");
    const { error } = await supabase.storage
      .from("portfolio-media")
      .remove([path]);
    if (error) throw error;
  };

  return { uploadImage, deleteImage };
}
