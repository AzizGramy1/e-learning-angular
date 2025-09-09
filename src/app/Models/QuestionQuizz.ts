export interface QuestionQuizz {
  id?: number;              // identifiant unique (optionnel car généré par le backend)
  quiz_id: number;          // l'ID du quiz associé
  intitule: string;         // l'intitulé de la question
  type: string;             // type de la question (ex: QCM, texte...)
  points: number;           // nombre de points attribués

  options?: string[];       // options disponibles (QCM par ex.)
  reponse_correcte?: string[]; // réponses correctes

  reponse_1?: string;       // réponse optionnelle (QCM)
  reponse_2?: string;
  reponse_3?: string;
  reponse_4?: string;

  created_at?: Date;        // date de création (optionnelle)
  updated_at?: Date;        // date de mise à jour (optionnelle)
}
