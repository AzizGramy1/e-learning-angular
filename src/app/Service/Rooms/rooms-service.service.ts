import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { AuthentificationService } from '../Authentification/authentification.service';

export interface Room {
  id: number;
  room_name: string;  // ou room_name selon ce que votre API utilise
  description: string;
  maxParticipants: number;
  isPrivate: boolean;
  status: string;
  participants: number;
  host: string;
  duration: string;
  createdAt: string;
  topic?: string;
  participantsList: string[];
}

export interface CreateRoomRequest {
  room_name: string;  // ou room_name selon ce que votre API attend
  description: string;
  maxParticipants: number;
  isPrivate: boolean;
  topic?: string;
}

export interface JoinRoomRequest {
  roomId: number;
  participantName: string;
  isHost: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class RoomsServiceService {

  private apiUrl = 'http://localhost:8000/api/livekit';
  private roomsSubject = new BehaviorSubject<Room[]>([]);
  public rooms$ = this.roomsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthentificationService // Injection du service d'auth
  ) {}

  // 🔐 Récupérer les headers d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('⚠️ Aucun token d\'authentification trouvé');
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Récupère toutes les salles disponibles
   */
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(rooms => {
        console.log('📥 Salles récupérées:', rooms);
        this.roomsSubject.next(rooms);
      }),
      catchError(this.handleError<Room[]>('getRooms', []))
    );
  }

  /**
   * Récupère une salle spécifique par son ID
   */
  getRoomById(roomId: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/rooms/${roomId}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError<Room>(`getRoom id=${roomId}`))
    );
  }

  /**
   * Crée une nouvelle salle
   */
  createRoom(roomData: CreateRoomRequest): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/rooms`, roomData, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap((newRoom: Room) => {
        console.log('✅ Salle créée:', newRoom);
        // Ajouter la nouvelle salle à la liste
        const currentRooms = this.roomsSubject.value;
        this.roomsSubject.next([...currentRooms, newRoom]);
      }),
      catchError(this.handleError<Room>('createRoom'))
    );
  }

  /**
   * Rejoint une salle existante
   */
  joinRoom(joinData: JoinRoomRequest): Observable<{ room: Room; token: string }> {
    return this.http.post<{ room: Room; token: string }>(
      `${this.apiUrl}/rooms/join`,
      joinData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log('🚪 Utilisateur a rejoint la salle:', response);
      }),
      catchError(this.handleError<{ room: Room; token: string }>('joinRoom'))
    );
  }

  /**
   * Quitte une salle
   */
  leaveRoom(roomId: number, participantName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/rooms/leave`, {
      roomId,
      participantName
    }, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(() => {
        console.log('👋 Utilisateur a quitté la salle:', roomId);
      }),
      catchError(this.handleError('leaveRoom'))
    );
  }

  /**
   * Filtre les salles localement
   */
  filterRooms(rooms: Room[], filter: string, searchTerm: string): Room[] {
    let filteredRooms = rooms;

    // Filtre par statut
    if (filter !== 'all') {
      filteredRooms = filteredRooms.filter(room => room.status === filter);
    }

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredRooms = filteredRooms.filter(room =>
        room.room_name.toLowerCase().includes(term) ||
        room.description.toLowerCase().includes(term) ||
        room.host.toLowerCase().includes(term) ||
        room.topic?.toLowerCase().includes(term)
      );
    }

    return filteredRooms;
  }

  /**
   * Met à jour le statut d'une salle
   */
  updateRoomStatus(roomId: number, status: 'live' | 'idle' | 'full'): Observable<Room> {
    return this.http.patch<Room>(`${this.apiUrl}/rooms/${roomId}/status`, { status }, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(updatedRoom => {
        // Mettre à jour la salle dans la liste
        const currentRooms = this.roomsSubject.value;
        const updatedRooms = currentRooms.map(room =>
          room.id === roomId ? { ...room, status } : room
        );
        this.roomsSubject.next(updatedRooms);
      }),
      catchError(this.handleError<Room>('updateRoomStatus'))
    );
  }

  /**
   * Supprime une salle
   */
  deleteRoom(roomId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rooms/${roomId}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(() => {
        // Retirer la salle de la liste
        const currentRooms = this.roomsSubject.value;
        const updatedRooms = currentRooms.filter(room => room.id !== roomId);
        this.roomsSubject.next(updatedRooms);
      }),
      catchError(this.handleError('deleteRoom'))
    );
  }

  /**
   * Méthode utilitaire pour rejoindre rapidement une room
   */
  async quickJoin(roomName: string, userName: string, role: string = 'participant'): Promise<any> {
    try {
      // Vérifier que l'utilisateur est connecté
      if (!this.authService.isLoggedIn()) {
        throw new Error('Utilisateur non connecté');
      }

      // D'abord, trouver la room par son nom
      const rooms = this.roomsSubject.value;
      const room = rooms.find(r => r.room_name === roomName);
      
      if (!room) {
        throw new Error(`Salle "${roomName}" non trouvée`);
      }

      const joinData = {
        roomId: room.id,
        participantName: userName,
        isHost: role === 'host'
      };

      const response = await this.joinRoom(joinData).toPromise();
      return response;
      
    } catch (error) {
      console.error('❌ Erreur quickJoin:', error);
      throw error;
    }
  }

  /**
   * Méthode utilitaire pour créer et rejoindre une room
   */
  async createAndJoinRoom(roomData: CreateRoomRequest, userName: string): Promise<any> {
    try {
      // Vérifier que l'utilisateur est connecté
      if (!this.authService.isLoggedIn()) {
        throw new Error('Utilisateur non connecté');
      }

      // Créer la salle
      const createdRoom = await this.createRoom(roomData).toPromise();
      
      // Rejoindre la salle
      const joinData = {
        roomId: createdRoom.id,
        participantName: userName,
        isHost: true
      };

      const response = await this.joinRoom(joinData).toPromise();
      return response;
      
    } catch (error) {
      console.error('❌ Erreur createAndJoinRoom:', error);
      throw error;
    }
  }

  /**
   * Test de connexion au backend
   */
  testConnection(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/health`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  /**
   * Obtenir un résumé complet d'une room
   */
  getRoomSummary(roomId: number): Observable<{
    room: Room | null;
    participants: string[];
    stats: any;
  }> {
    return new Observable(observer => {
      const room = this.roomsSubject.value.find(r => r.id === roomId) || null;
      
      observer.next({
        room,
        participants: room?.participantsList || [],
        stats: {
          participants: room?.participants || 0,
          maxParticipants: room?.maxParticipants || 0,
          status: room?.status || 'unknown'
        }
      });
      observer.complete();
    });
  }

  /**
   * Vérifier si l'utilisateur est connecté (méthode utilitaire)
   */
  isUserAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * Obtenir l'utilisateur connecté (méthode utilitaire)
   */
  getCurrentUser() {
    return this.authService.getUser();
  }

  /**
   * Rafraîchir le token si nécessaire
   */
  refreshTokenIfNeeded(): Observable<boolean> {
    if (!this.authService.isLoggedIn()) {
      return of(false);
    }
    
    // Ici vous pourriez implémenter une logique de refresh token
    // Pour l'instant, on retourne simplement true si l'utilisateur est connecté
    return of(true);
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`❌ ${operation} a échoué:`, error);
      
      // Gestion spécifique des erreurs d'authentification
      if (error.status === 401) {
        console.warn('🔐 Token expiré ou invalide');
        // Optionnel: Rediriger vers la page de login
        // this.authService.clearToken();
      }
      
      // Retourner un résultat vide pour permettre à l'application de continuer
      return of(result as T);
    };
  }
}