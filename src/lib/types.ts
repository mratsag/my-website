// lib/types.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
  location?: string;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 1-5
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Form türleri
export interface ContactForm {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ProjectForm {
  title: string;
  description: string;
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  featured: boolean;
}

export interface ExperienceForm {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
  location?: string;
}

export interface SkillForm {
  name: string;
  category: string;
  proficiency: number;
}

export interface BlogPostForm {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  published: boolean;
}

// API Response türleri
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}