import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl = 'http://127.0.0.1:8000/api/courses'; // ⚡ adapte selon ton backend

  constructor(private http: HttpClient) {}

  // 📌 1. Récupérer tous les cours
  getCourses(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // 📌 2. Récupérer un cours par ID
  getCourse(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // 📌 3. Créer un cours
  createCourse(courseData: any): Observable<any> {
    return this.http.post(this.apiUrl, courseData);
  }

  // 📌 4. Mettre à jour un cours
  updateCourse(id: number, courseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, courseData);
  }

  // 📌 5. Supprimer un cours
  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 📌 6. Inscrire un utilisateur
  inscrire(courseId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/inscrire`, { user_id: userId });
  }

  // 📌 7. Désinscrire un utilisateur
  desinscrire(courseId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${courseId}/desinscrire/${userId}`);
  }

  // 📌 8. Liste des étudiants d’un cours
  getEtudiants(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/etudiants`);
  }

  // 📌 9. Cours d’un utilisateur
  getCoursesByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  // 📌 10. Détails complets d’un cours (+ si inscrit)
  getCourseDetail(id: number, userId?: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/detail`, {
      params: userId ? { user_id: userId.toString() } : {}
    });
  }
}
