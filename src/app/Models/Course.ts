export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  status: string;
  statusLabel: string;
  category: string;
  rating: number;
  hoursCompleted: number;
  hoursTotal: number;
  chaptersCompleted: number;
  chaptersTotal: number;
  progress: number;
  progressColor: string;
}
