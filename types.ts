
export interface ContactInfo {
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  location: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
}

export interface Education {
  id:string;
  institution: string;
  degree: string;
  duration: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface CustomItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export type SectionContent = 
  | string // for summary
  | WorkExperience[]
  | Education[]
  | Project[]
  | Record<string, string[]> // for skills
  | CustomItem[]; // for custom sections

export interface ResumeSection {
  id: string;
  title: string;
  type: 'summary' | 'experience' | 'education' | 'projects' | 'skills' | 'custom' | 'certifications' | 'awards' | 'volunteer' | 'interests';
  content: SectionContent;
  isDeletable: boolean;
}

export interface ResumeData {
  name: string;
  title: string;
  contact: ContactInfo;
  sections: ResumeSection[];
}

export type Template = 'classic' | 'corporate' | 'creative' | 'executive' | 'technical';
export type ColorPalette = 'blue' | 'green' | 'black' | 'purple';

export interface StyleOptions {
    template: Template;
    colorPalette: ColorPalette;
}

export interface User {
  email: string;
  role: 'admin' | 'user';
}
