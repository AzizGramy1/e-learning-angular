import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { Course } from 'src/app/Models/Course';
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
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers: this.getAuthHeaders() });
  }

  // 📌 Récupérer info utilisateur connecté
  me(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() });
  }

  // 📌 Stocker le token
  saveToken(token: string): void {
    localStorage.setItem('access_token', token); // ✅ cohérent avec UserService
  }

  // 📌 Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // 📌 Supprimer le token
  clearToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
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

  // 📌 Sauvegarder l'utilisateur connecté
  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // 📌 Récupérer l'utilisateur connecté
  getUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }


    /** Récupérer les cours d’un utilisateur en incluant le token JWT */
  getUserCourses(userId: number): Observable<Course[]> {
    const token = localStorage.getItem('access_token'); // récupère le token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Course[]>(`${this.apiUrl}/users/${userId}/courses`, { headers });
  }

  // 📌 NOUVELLES MÉTHODES AJOUTÉES
  /** Récupérer l'ID de l'utilisateur connecté */
  getUserId(): number | null {
    const user = this.getUser();
    return user?.id || null;
  }

  /** Récupérer le nom de l'utilisateur connecté */
  getUserName(): string | null {
    const user = this.getUser();
    return user?.nom || null;
  }

  /** Récupérer l'email de l'utilisateur connecté */
  getUserEmail(): string | null {
    const user = this.getUser();
    return user?.email || null;
  }

  /** Vérifier si l'utilisateur a un rôle spécifique */
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  /** Récupérer le rôle de l'utilisateur */
  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }
}
