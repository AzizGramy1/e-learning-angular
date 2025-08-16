import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/Models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) {}

  /** 🔹 Génère les headers avec le token JWT */
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('access_token')}` // ✅ cohérent avec AuthService
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

  updateUser(id: number, data: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, data, this.getHeaders());
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, this.getHeaders());
  }

  // ================================
  // RELATIONS UTILISATEURS
  // ================================
  
  getUserCertificats(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}/certificats`, this.getHeaders());
  }

  getUserMessages(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}/messages`, this.getHeaders());
  }

  getUserPaiements(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}/paiements`, this.getHeaders());
  }

  getUserRapports(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}/rapports`, this.getHeaders());
  }
}
