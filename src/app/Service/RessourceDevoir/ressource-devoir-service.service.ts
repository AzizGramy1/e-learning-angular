import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthentificationService } from '../Authentification/authentification.service';
import { RessourceDevoir } from 'src/app/Models/RessourceDevoir';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RessourceDevoirServiceService {

  private apiUrl = 'http://127.0.0.1:8000/api/ressources';

  constructor(
    private http: HttpClient,
    private authService: AuthentificationService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAll(): Observable<RessourceDevoir[]> {
    return this.http.get<RessourceDevoir[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<RessourceDevoir> {
    return this.http.get<RessourceDevoir>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getByName(name: string): Observable<RessourceDevoir> {
    return this.http.get<RessourceDevoir>(`${this.apiUrl}/name/${name}`, { headers: this.getHeaders() });
  }

  create(ressource: RessourceDevoir): Observable<RessourceDevoir> {
    return this.http.post<RessourceDevoir>(this.apiUrl, ressource, { headers: this.getHeaders() });
  }

  update(id: number, ressource: RessourceDevoir): Observable<RessourceDevoir> {
    return this.http.put<RessourceDevoir>(`${this.apiUrl}/${id}`, ressource, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // 🔹 récupérer toutes les ressources d’un devoir
  getByDevoir(devoirId: number): Observable<RessourceDevoir[]> {
    return this.http.get<RessourceDevoir[]>(`http://127.0.0.1:8000/api/devoirs/${devoirId}/ressources`, { 
      headers: this.getHeaders() 
    });
  }
}
