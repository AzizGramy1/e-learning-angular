import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthentificationService } from '../Authentification/authentification.service';
import { SessionResponse } from 'src/app/Models/SessionResponse';
import { TokenResponse } from 'src/app/Models/TokenResponse';
import { CallResponse } from 'src/app/Models/CallResponde';

@Injectable({
  providedIn: 'root'
})
export class VideoCallServiceService {

private apiUrl = 'http://127.0.0.1:8000/api/openvidu'; // Ajuste selon ton serveur Laravel

  constructor(private http: HttpClient) {}

// Créer une session
  createSession(customSessionId: string): Observable<any> {
    const url = `${this.apiUrl}/session`;
    const body = { customSessionId };
    return this.http.post(url, body).pipe(
      catchError(this.handleError)
    );
  }

  // Générer un token
generateToken(sessionId: string): Observable<string> {
  const url = `${this.apiUrl}/token`;
  return this.http.post<any>(url, { sessionId }).pipe(
    map(res => {
      // On récupère la vraie chaîne du token
      return res.token?.token?.token;
    }),
    catchError(this.handleError)
  );
} 

  // Démarrer un appel
  startCall(sessionId: string): Observable<any> {
    const url = `${this.apiUrl}/start-call`;
    const body = { sessionId };
    return this.http.post(url, body).pipe(
      catchError(this.handleError)
    );
  }

  // Terminer un appel
  endCall(sessionId: string): Observable<any> {
    const url = `${this.apiUrl}/end-call`;
    const body = { sessionId };
    return this.http.post(url, body).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les détails d'une session
  getSessionDetails(sessionId: string): Observable<any> {
    const url = `${this.apiUrl}/session-details`;
    const body = { sessionId };
    return this.http.post(url, body).pipe(
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: any) {
    console.error('Une erreur s\'est produite:', error);
    return throwError(() => new Error('Erreur lors de l\'appel à OpenVidu : ' + error.message));
  }


}
