// category.model.ts
export interface Category {
  id: number;
  nom: string;
  slug: string;
  description?: string;
  couleur?: string;
  icone?: string;
  est_active: boolean;
  ordre_affichage: number;
  nombre_reunions: number;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
