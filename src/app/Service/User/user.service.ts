import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:8000/api'; // 🔹 Ton URL API Laravel

  constructor(private http: HttpClient) {}

  /** 🔹 Génère les headers avec le token JWT */
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  // ================================
  // AUTHENTIFICATION
  // ================================
  
  /** 🔹 Login utilisateur */
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  /** 🔹 Logout utilisateur */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, this.getHeaders());
  }

  /** 🔹 Profil utilisateur connecté */
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, this.getHeaders());
  }

  /** 🔹 Mise à jour du profil */
  updateProfile(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/update`, data, this.getHeaders());
  }

  // ================================
  // CRUD UTILISATEURS
  // ================================
  
  getUsers(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { ...this.getHeaders(), params });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`, this.getHeaders());
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, data, this.getHeaders());
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, data, this.getHeaders());
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
