import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from 'src/app/Models/Course';
import { User } from 'src/app/Models/User';
import { AuthentificationService } from '../Authentification/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient, private authentificationService: AuthentificationService) {}

  /** 🔹 Génère les headers avec le token JWT */
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authentificationService.getToken()}` // ✅ utiliser l'instance injectée
      })
    };
  }

  // ================================
  // CRUD UTILISATEURS
  // ================================
  
  getUsers(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { ...this.getHeaders(), params });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, this.getHeaders());
  }

  createUser(data: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, data, this.getHeaders());
  }

  updateUser(id: number, data: any): Observable<any> {
  // ✅ Utiliser la bonne route POST /update-profile
  return this.http.post<any>(`${this.apiUrl}/update-profile`, data, this.getHeaders());
}

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, this.getHeaders());
  }

  // ================================
  // RELATIONS UTILISATEURS
  // ================================
  

  // 🔹 Récupérer les certificats d’un utilisateur
  getUserCertificats(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}/certificats`, this.getHeaders());
  }

  // 🔹 Récupérer les messages d’un utilisateur
  getUserMessages(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}/messages`, this.getHeaders());
  }

  // 🔹 Récupérer les paiements d’un utilisateur
  getUserPaiements(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}/paiements`, this.getHeaders());
  }


  // 🔹 Récupérer les rapports d’un utilisateur
  getUserRapports(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}/rapports`, this.getHeaders());
  }

    /** 🔹 Récupérer les cours d’un utilisateur */
  getUserCourses(userId: number): Observable<Course[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authentificationService.getToken()}`
    });

    return this.http.get<Course[]>(`${this.apiUrl}/users/${userId}/courses`, { headers });
  }
}

 





  

