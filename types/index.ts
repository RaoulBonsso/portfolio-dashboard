export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo: string;
  email: string;
  phone: string;
  location: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  links: {
    demo: string;
    repo: string;
  };
  technologies: string[];
  featured: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  date: string;
  status: "valid" | "expired" | "in-progress";
  url: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  tags: string[];
  status: "published" | "draft";
  publishedAt: string;
}

export interface AnalyticsData {
  visits: { date: string; value: number }[];
  clicks: { date: string; value: number }[];
  sources: { name: string; value: number }[];
  pages: { name: string; views: number }[];
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  page_path: string;
  session_id: string;
  referrer: string;
  country: string;
  device: string;
  created_at: string;
}
