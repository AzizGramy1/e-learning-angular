import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoCallServiceService {

  private apiUrl = 'http://localhost:8000'; // URL de ton Laravel

  constructor(private http: HttpClient) {}

  // Obtient un token JWT (si sécurisé)
  getToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
  }

  // Crée une session
  createSession(): Observable<any> {
    return this.http.post(`${this.apiUrl}/video/session`, { customSessionId: 'angular-session' });
  }

  // Crée un token pour une session
  createToken(sessionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/video/token`, { sessionId });
  }

  // Démarre un appel
  startCall(callerId: string, receiverId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/video/start`, { caller_id: callerId, receiver_id: receiverId });
  }

  // Termine un appel
  endCall(sessionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/video/end`, { sessionId });
  }
}
