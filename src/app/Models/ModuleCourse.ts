export interface ModuleCourse {
  id: number;
  title: string;
  description: string;
  course_id: number;
  course?: any;       // pour les infos du cours parent
  quizzes?: any[];    // pour les quizzes du module
}
