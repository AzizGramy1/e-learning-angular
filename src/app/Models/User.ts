export interface User {
  id?: number;
  nom: string;
  email: string;
  role: string;            // ou enum si tu as un UserRole TS
  password?: string;
  avatar_url?: string;
  adresse?: string;
  niveau?: string;
  telephone?: string;
  date_naissance?: string; // string ISO ou Date
  langues?: string[];      // tableau de langues
  progression?: number;
  heures?: number;
  skills?: string[];       // tableau de compétences
  badges?: string[];       // tableau de badges
  social_links?: { icon: string; link: string }[];
  activities?: { icon: string; description: string; time: string }[];
  education?: { degree: string; institution: string; year: string }[];
  experience?: { role: string; company: string; period: string }[];
  goals?: { name: string; progress: number; color: string; progressBarClass: string }[];
  created_at?: string;
  updated_at?: string;
}
