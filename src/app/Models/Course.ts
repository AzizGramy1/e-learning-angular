export interface Course {
  id: number;
  title: string;                  // titre
  description: string;            // description
  image: string;                  // image
  status: string;                 // statut (En cours, Terminé, Nouveau, Favori)
  statusLabel: string;            // label affiché (optionnel, par ex: badge coloré)
  category: string;               // categorie
  difficulty: string;             // difficulte
  note: number;                 // note
  hoursCompleted: number;         // heures complétées
  hoursTotal: number;             // duree_totale
  chaptersCompleted: number;      // chapitres_completes
  chaptersTotal: number;          // chapitres_total
  progress: number;               // progression en %
  progressColor: string;          // couleur pour la barre de progression
  certificateObtained: boolean;   // certificat_obtenu
  instructor: string;             // auteur
  tags: string[];                 // tags
}
