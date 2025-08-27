import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reunion } from 'src/app/Models/Reunion';
import { AuthentificationService } from '../Authentification/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {

  private apiUrl = 'http://127.0.0.1:8000/api/reunions';

  constructor(private http: HttpClient, private authService: AuthentificationService) { }

  /** 🔹 Générer les headers avec JWT */
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`
      })
    };
  }

  // 🔹 Liste de toutes les réunions
  getAllReunions(params?: any): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(this.apiUrl, { ...this.getHeaders(), params });
  }

  // 🔹 Réunion spécifique
  getReunion(id: number): Observable<Reunion> {
    return this.http.get<Reunion>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  // 🔹 Créer une réunion
  createReunion(data: Reunion): Observable<Reunion> {
    return this.http.post<Reunion>(this.apiUrl, data, this.getHeaders());
  }

  // 🔹 Mettre à jour une réunion
  updateReunion(id: number, data: Partial<Reunion>): Observable<Reunion> {
    return this.http.put<Reunion>(`${this.apiUrl}/${id}`, data, this.getHeaders());
  }

  // 🔹 Supprimer une réunion
  deleteReunion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  // 🔹 Mes réunions (utilisateur connecté)
  getMesReunions(): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(`${this.apiUrl}/mes-reunions`, this.getHeaders());
  }

  // 🔹 Rejoindre une réunion
  rejoindreReunion(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/rejoindre`, {}, this.getHeaders());
  }

  // 🔹 Quitter une réunion
  quitterReunion(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/quitter`, {}, this.getHeaders());
  }

  // 🔹 Vérifier si inscrit
  estInscrit(id: number): Observable<{inscrit: boolean}> {
    return this.http.get<{inscrit: boolean}>(`${this.apiUrl}/${id}/est-inscrit`, this.getHeaders());
  }

  // 🔹 Ajouter un participant (admin / instructeur)
  ajouterParticipant(reunionId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${reunionId}/ajouter-participant/${userId}`, {}, this.getHeaders());
  }

  // 🔹 Retirer un participant (admin / instructeur)
  retirerParticipant(reunionId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${reunionId}/retirer-participant/${userId}`, {}, this.getHeaders());
  }

  // 🔹 Actions sur la réunion
  demarrerReunion(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/demarrer`, {}, this.getHeaders());
  }

  terminerReunion(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/terminer`, {}, this.getHeaders());
  }

  annulerReunion(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/annuler`, {}, this.getHeaders());
  }

  // 🔹 Populaires
  getPopulaires(limit: number = 5): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(`${this.apiUrl}/populaires/${limit}`, this.getHeaders());
  }

  // 🔹 Disponibles
  getDisponibles(): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(`${this.apiUrl}/disponibles`, this.getHeaders());
  }
}

export { Reunion };
