import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, lastValueFrom } from 'rxjs';
import { AuthentificationService } from '../Authentification/authentification.service';


export interface LiveKitRoom {
  name: string;
  num_participants: number;
  max_participants: number;
  creation_time: string;
  empty_timeout?: number;
  departure_timeout?: number;
  sid?: string;
}

export interface LiveKitSession {
  room_name: string;
  token: string;
  participant_name: string;
  role: string;
  room_data?: any;
  livekit_url?: string;
  ws_url?: string;
}

export interface LiveKitParticipant {
  identity: string;
  name: string;
  is_speaker?: boolean;
  joined_at?: string;
}

export interface LiveKitStats {
  room_name: string;
  active_participants: number;
  total_participants: number;
  max_participants: number;
  room_status: string;
  room_created?: string;
  participants_details?: any[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  session?: LiveKitSession;
  rooms?: LiveKitRoom[];
  participants?: LiveKitParticipant[];
  stats?: LiveKitStats;
  room?: LiveKitRoom;
}

@Injectable({
  providedIn: 'root'
})
export class LivekitService {

  private apiUrl = 'http://127.0.0.1:8000/api';
  private currentSession = new BehaviorSubject<LiveKitSession | null>(null);
  private currentToken = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthentificationService // Injection du service d'auth
  ) {}

  // 🔐 Récupérer les headers d'authentification via AuthentificationService
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Utilise le service d'auth
    if (!token) {
      console.warn('⚠️ Aucun token d\'authentification trouvé');
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  // 🔍 Statut LiveKit
  getLiveKitStatus(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}/livekit/status`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('🔍 Statut LiveKit:', response))
    );
  }

  // 🧪 Test de connexion
  testConnection(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}/livekit/test`,
      { headers: this.getAuthHeaders() }
    );
  }

  // 🎫 Générer un token
  generateToken(roomName: string, participantName: string, isCreator: boolean = false): Observable<ApiResponse<{token: string}>> {
    return this.http.post<ApiResponse<{token: string}>>(
      `${this.apiUrl}/livekit/token/generate`,
      {
        room_name: roomName,
        participant_name: participantName,
        is_creator: isCreator
      },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.currentToken.next(response.token);
        }
      })
    );
  }

  // 🏠 Créer une salle
  createRoom(roomName: string, maxParticipants?: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/livekit/rooms`,
      {
        room_name: roomName,
        max_participants: maxParticipants
      },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('🏠 Salle créée:', response))
    );
  }

  // 📋 Lister toutes les salles
  listRooms(): Observable<ApiResponse<{rooms: LiveKitRoom[]}>> {
    return this.http.get<ApiResponse<{rooms: LiveKitRoom[]}>>(
      `${this.apiUrl}/livekit/rooms`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('📋 Salles listées:', response.rooms?.length))
    );
  }

  // 🔍 Obtenir les infos d'une salle
  getRoomInfo(roomName: string): Observable<ApiResponse<{room: LiveKitRoom}>> {
    return this.http.get<ApiResponse<{room: LiveKitRoom}>>(
      `${this.apiUrl}/livekit/rooms/${roomName}/info`,
      { headers: this.getAuthHeaders() }
    );
  }

  // 🗑️ Supprimer une salle
  deleteRoom(roomName: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.apiUrl}/livekit/rooms/${roomName}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('🗑️ Salle supprimée:', response))
    );
  }

  // 👥 Lister les participants d'une salle
  listParticipants(roomName: string): Observable<ApiResponse<{participants: LiveKitParticipant[]}>> {
    return this.http.get<ApiResponse<{participants: LiveKitParticipant[]}>>(
      `${this.apiUrl}/livekit/rooms/${roomName}/participants`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('👥 Participants:', response.participants?.length))
    );
  }

  // 📊 Obtenir les statistiques d'une salle
  getRoomStats(roomName: string): Observable<ApiResponse<{stats: LiveKitStats}>> {
    return this.http.get<ApiResponse<{stats: LiveKitStats}>>(
      `${this.apiUrl}/livekit/rooms/${roomName}/stats`,
      { headers: this.getAuthHeaders() }
    );
  }

  // 🎥 Créer une session d'appel vidéo
  createVideoCallSession(
    roomName?: string,
    maxParticipants?: number,
    sessionType: string = 'group_call',
    options: any = {}
  ): Observable<ApiResponse<{session: LiveKitSession}>> {
    return this.http.post<ApiResponse<{session: LiveKitSession}>>(
      `${this.apiUrl}/livekit/sessions/create`,
      {
        room_name: roomName,
        max_participants: maxParticipants,
        session_type: sessionType,
        options: options
      },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('🎥 Session créée:', response))
    );
  }

  // 🔄 Rejoindre une session d'appel vidéo (FONCTION PRINCIPALE) - CORRIGÉE
  joinVideoCallSession(roomName: string, participantName: string, role: string = 'participant'): Observable<ApiResponse<{session: LiveKitSession}>> {
    return this.http.post<ApiResponse<{session: LiveKitSession}>>(
      `${this.apiUrl}/livekit/sessions/join`,
      {
        room_name: roomName,
        participant_name: participantName,
        role: role
      },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.session) {
          this.currentSession.next(response.session);
          console.log('✅ Session rejointe:', response.session);
        }
      })
    );
  }

  // 📱 Créer un appel 1:1 rapide
  createOneOnOneCall(targetUserId: number): Observable<ApiResponse<{session: LiveKitSession}>> {
    return this.http.post<ApiResponse<{session: LiveKitSession}>>(
      `${this.apiUrl}/livekit/sessions/one-on-one`,
      {
        target_user_id: targetUserId
      },
      { headers: this.getAuthHeaders() }
    );
  }

  // 📚 Créer une session de cours
  createCourseSession(
    courseId: number,
    sessionTitle: string,
    maxParticipants?: number,
    enableRecording: boolean = false
  ): Observable<ApiResponse<{session: LiveKitSession}>> {
    return this.http.post<ApiResponse<{session: LiveKitSession}>>(
      `${this.apiUrl}/livekit/sessions/course`,
      {
        course_id: courseId,
        session_title: sessionTitle,
        max_participants: maxParticipants,
        enable_recording: enableRecording
      },
      { headers: this.getAuthHeaders() }
    );
  }

  // 🔄 Régénérer un token
  regenerateToken(roomName: string, participantName: string, role: string): Observable<ApiResponse<{token: string}>> {
    return this.http.post<ApiResponse<{token: string}>>(
      `${this.apiUrl}/livekit/token/regenerate`,
      {
        room_name: roomName,
        participant_name: participantName,
        role: role
      },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.currentToken.next(response.token);
        }
      })
    );
  }

  // 🎯 Générer un token pour appel vidéo
  generateVideoCallToken(roomName: string, participantName: string, role: string): Observable<ApiResponse<{token: string}>> {
    return this.http.post<ApiResponse<{token: string}>>(
      `${this.apiUrl}/livekit/token/video-call`,
      {
        room_name: roomName,
        participant_name: participantName,
        role: role
      },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.currentToken.next(response.token);
        }
      })
    );
  }

  // 🔄 Créer une session pour l'utilisateur connecté
  createSessionForUser(maxParticipants?: number): Observable<ApiResponse<{session: LiveKitSession}>> {
    return this.http.post<ApiResponse<{session: LiveKitSession}>>(
      `${this.apiUrl}/livekit/sessions/user`,
      {
        max_participants: maxParticipants
      },
      { headers: this.getAuthHeaders() }
    );
  }

  // 🔧 Gestion de la session courante
  getCurrentSession(): Observable<LiveKitSession | null> {
    return this.currentSession.asObservable();
  }

  setCurrentSession(session: LiveKitSession): void {
    this.currentSession.next(session);
  }

  clearCurrentSession(): void {
    this.currentSession.next(null);
  }

  // 🔧 Gestion du token courant
  getCurrentToken(): Observable<string | null> {
    return this.currentToken.asObservable();
  }

  setCurrentToken(token: string): void {
    this.currentToken.next(token);
  }

  clearCurrentToken(): void {
    this.currentToken.next(null);
  }

  // 🎯 Méthode utilitaire pour rejoindre rapidement une room - CORRIGÉE
  async quickJoin(roomName: string, userName: string, role: string = 'participant'): Promise<LiveKitSession> {
    // Vérifier que l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      throw new Error('Utilisateur non connecté');
    }

    const response = await lastValueFrom(
      this.joinVideoCallSession(roomName, userName, role)
    );
    
    if (response.success && response.session) {
      return response.session;
    } else {
      throw new Error(response.message || 'Erreur inconnue');
    }
  }

  // 🎯 Méthode utilitaire pour créer et rejoindre une room - CORRIGÉE
  async createAndJoinRoom(roomName: string, userName: string, maxParticipants?: number): Promise<LiveKitSession> {
    try {
      // Vérifier que l'utilisateur est connecté
      if (!this.authService.isLoggedIn()) {
        throw new Error('Utilisateur non connecté');
      }

      // Créer la salle
      const createResponse = await lastValueFrom(
        this.createRoom(roomName, maxParticipants)
      );
      
      if (!createResponse.success) {
        throw new Error(createResponse.message || 'Erreur création salle');
      }

      // Rejoindre la salle
      return await this.quickJoin(roomName, userName, 'host');
      
    } catch (error) {
      console.error('❌ Erreur createAndJoinRoom:', error);
      throw error;
    }
  }

  // 📊 Méthode pour obtenir un résumé d'une room - CORRIGÉE
  getRoomSummary(roomName: string): Observable<{
    info: LiveKitRoom | null,
    stats: LiveKitStats | null,
    participants: LiveKitParticipant[] | null
  }> {
    return new Observable(observer => {
      let roomInfo: LiveKitRoom | null = null;
      let roomStats: LiveKitStats | null = null;
      let participants: LiveKitParticipant[] | null = null;
      let completedRequests = 0;

      const checkCompletion = () => {
        completedRequests++;
        if (completedRequests === 3) {
          observer.next({ 
            info: roomInfo, 
            stats: roomStats, 
            participants 
          });
          observer.complete();
        }
      };

      // Obtenir les infos de la room
      this.getRoomInfo(roomName).subscribe({
        next: (response) => {
          if (response.success) {
            roomInfo = response.room || null;
          }
          checkCompletion();
        },
        error: () => checkCompletion()
      });

      // Obtenir les statistiques
      this.getRoomStats(roomName).subscribe({
        next: (response) => {
          if (response.success) {
            roomStats = response.stats || null;
          }
          checkCompletion();
        },
        error: () => checkCompletion()
      });

      // Obtenir les participants
      this.listParticipants(roomName).subscribe({
        next: (response) => {
          if (response.success) {
            participants = response.participants || null;
          }
          checkCompletion();
        },
        error: () => checkCompletion()
      });
    });
  }

  // 🔐 Vérifier si l'utilisateur est connecté (méthode utilitaire)
  isUserAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  // 👤 Obtenir l'utilisateur connecté (méthode utilitaire)
  getCurrentUser() {
    return this.authService.getUser();
  }








  
}