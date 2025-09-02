export interface Devoir {
  id?: number;                     // ID du devoir
  course_id: number;               // Référence au cours
  user_id: number;                 // Référence à l'utilisateur (professeur)

  titre: string;                   // Titre du devoir
  description?: string;            // Description détaillée
  module?: string;                 // Module ou section
  points?: number;                 // Points du devoir, défaut 0

  date_limite?: string;            // Date limite de rendu (format ISO)
  categorie?: string;              // Catégorie du devoir
  statut?: 'en_attente' | 'en_retard' | 'terminé' | 'actif'; // Statut

  instructions?: string;           // Instructions détaillées
  type_remise?: 'fichier' | 'lien' | 'fichier_et_lien'; // Type de remise
  fichiers_joints?: string[];      // Liste de fichiers joints (JSON)

  fichier_url?: string;            // URL du fichier à remettre

  created_at?: string;             // Date de création
  updated_at?: string;             // Date de mise à jour
}
