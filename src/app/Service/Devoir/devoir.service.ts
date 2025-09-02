import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Devoir } from 'src/app/Models/Devoir';
import { RenduDevoir } from 'src/app/Models/RenduDevoir';
import { AuthentificationService } from '../Authentification/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class DevoirService {

  private apiUrl = 'http://127.0.0.1:8000/api/devoirs';

  constructor(
    private http: HttpClient,
    private authService: AuthentificationService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // 📌 Récupérer tous les devoirs
  getAll(): Observable<Devoir[]> {
    return this.http.get<Devoir[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // 📌 Récupérer un devoir par id
  getById(id: number): Observable<Devoir> {
    return this.http.get<Devoir>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // 📌 Créer un devoir
  create(devoir: Devoir): Observable<Devoir> {
    return this.http.post<Devoir>(this.apiUrl, devoir, { headers: this.getHeaders() });
  }

  // 📌 Mettre à jour un devoir
  update(id: number, devoir: Devoir): Observable<Devoir> {
    return this.http.put<Devoir>(`${this.apiUrl}/${id}`, devoir, { headers: this.getHeaders() });
  }

  // 📌 Supprimer un devoir
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // 📌 Récupérer les devoirs d’un professeur
  getByProfesseur(professeurId: number): Observable<Devoir[]> {
    return this.http.get<Devoir[]>(`${this.apiUrl}/professeur/${professeurId}`, { headers: this.getHeaders() });
  }

  // 📌 Récupérer les devoirs d’un étudiant (avec rendus)
  getByEtudiant(etudiantId: number): Observable<Devoir[]> {
    return this.http.get<Devoir[]>(`${this.apiUrl}/etudiant/${etudiantId}`, { headers: this.getHeaders() });
  }

  // 📌 Rechercher par titre
  searchByTitre(titre: string): Observable<Devoir[]> {
    return this.http.get<Devoir[]>(`${this.apiUrl}/search/titre?titre=${titre}`, { headers: this.getHeaders() });
  }

  // 📌 Rechercher par date limite
  searchByDate(date: string): Observable<Devoir[]> {
    return this.http.get<Devoir[]>(`${this.apiUrl}/search/date?date=${date}`, { headers: this.getHeaders() });
  }

  // 📌 Devoirs en retard 
  devoirsEnRetard(): Observable<Devoir[]> {
    return this.http.get<Devoir[]>(`${this.apiUrl}/en-retard`, { headers: this.getHeaders() });
  }

  // 📌 Devoirs à venir 
  devoirsAVenir(): Observable<Devoir[]> {
    return this.http.get<Devoir[]>(`${this.apiUrl}/a-venir`, { headers: this.getHeaders() });
  }

  // 📌 Statistiques d’un devoir    
  statsRendus(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/stats-rendus`, { headers: this.getHeaders() });
  }

  // 📌 Récupérer les devoirs à venir non rendus pour un étudiant spécifique
  devoirsAVenirNonRendus(etudiantId: number): Observable<Devoir[]> {
    return this.http.get<Devoir[]>(`${this.apiUrl}/etudiant/${etudiantId}/a-venir-non-rendus`, { 
      headers: this.getHeaders() 
    });
}

searchById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/search/${id}`, { headers: this.getHeaders() });
}

}
