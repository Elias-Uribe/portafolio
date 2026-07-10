export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'tools'
  | 'architecture';

export interface Skill {
  name: string;
  category: SkillCategory;
  yearsUsed?: number;
  icon?: string;
  deviconClass?: string;
}

export type ProjectStatus = 'completed' | 'in-progress' | 'archived';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: ProjectStatus;
  tech: string[];
  role: string;
  year: number;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  confidential?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  current: boolean;
  description: string;
  achievements: string[];
  tech: string[];
}

export interface Education {
  id: string;
  title: string;
  institution: string;
  period: string;
  current: boolean;
}

export type TimelineType = 'education' | 'work' | 'milestone';

export interface TimelineEntry {
  year: string;
  title: string;
  institution: string;
  description: string;
  type: TimelineType;
}
