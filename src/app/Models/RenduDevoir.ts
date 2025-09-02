export interface RenduDevoir {
  id?: number;                     // ID du rendu
  devoir_id: number;               // Référence au devoir
  user_id: number;                 // Étudiant qui a soumis
  correcteur_id?: number | null;   // Professeur correcteur (facultatif)

  fichier_url: string;             // URL du fichier rendu
  note?: number | null;            // Note attribuée (decimal)
  commentaire?: string | null;     // Commentaire du correcteur
  date_soumission?: string | null; // Date de soumission (ISO string)
  etat?: 'en_attente' | 'corrige' | 'en_retard'; // Statut du rendu

  created_at?: string;             // Date de création
  updated_at?: string;             // Date de mise à jour
}
