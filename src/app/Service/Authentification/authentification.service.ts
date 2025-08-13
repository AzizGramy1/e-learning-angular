import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from 'src/app/Models/User';


@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private apiUrl = 'http://127.0.0.1:8000/api/auth';

  constructor(private http: HttpClient) { }

  // 📌 Login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // 📌 Déconnexion
  logout(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  // 📌 Récupérer info utilisateur connecté
  me(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  // 📌 Stocker le token
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // 📌 Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // 📌 Supprimer le token
  clearToken(): void {
    localStorage.removeItem('access_token');
  }

  // 📌 Récupérer headers d'auth
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // 📌 Décoder le token
  decodeToken(): any {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  // 📌 Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}

