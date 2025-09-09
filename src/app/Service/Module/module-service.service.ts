import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleCourse } from 'src/app/Models/ModuleCourse';

@Injectable({
  providedIn: 'root'
})
export class ModuleServiceService {

   private apiUrl = 'http://localhost:8000/api/modules'; // adapte selon ton URL

  constructor(private http: HttpClient) { }

  // Lister tous les modules
  getAllModules(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Afficher un module spécifique
  getModuleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Créer un module
  createModule(module: Partial<ModuleCourse>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, module);
  }

  // Mettre à jour un module
  updateModule(id: number, module: Partial<ModuleCourse>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, module);
  }

  // Supprimer un module
  deleteModule(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Récupérer tous les modules d’un cours spécifique
  getModulesByCourse(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/course/${courseId}`);
  }

  // Récupérer tous les quizzes d’un module
  getQuizzesByModule(moduleId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${moduleId}/quizzes`);
  }
}
