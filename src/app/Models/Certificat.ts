export interface Certificat {
  id?: number;                 // ID du certificat (optionnel car généré par la DB)
  utilisateur_id: number;      // Référence à l'utilisateur
  cours_id: number;            // Référence au cours
  date_emission: Date;         // Date d'émission
  code_certificat: string;     // Code unique de vérification
  note: number;                // Note obtenue (ex: 85%)
  description_obtention: string; // Texte descriptif : "Certificat obtenu pour ..."
  mention?: string;            // Optionnel : "Excellent", "Honorable", etc.
  heures?: number;             // Optionnel : heures de formation complétées
}
