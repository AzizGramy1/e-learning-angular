export interface Reunion {
  id?: number;
  titre: string;
  description?: string;
  date_debut?: Date;
  date_fin?: Date;
  statut?: 'planifie' | 'en_cours' | 'termine' | 'annule';
  lien_video?: string;
  nombre_participants?: number;
  max_participants?: number;
  note?: number; // note moyenne
  instructeur_id?: number;
  categorie_id?: number;
  image_url?: string;
  est_prive?: boolean;
  mot_de_passe?: string;
  enregistrement_url?: string;
  duree?: number; // en minutes
  course_id?: number;

  // Attributs calculés
  est_en_direct?: boolean;
  est_a_venir?: boolean;
  est_termine?: boolean;
  duree_formattee?: string;
  places_disponibles?: number | null;
  est_complet?: boolean;
}
