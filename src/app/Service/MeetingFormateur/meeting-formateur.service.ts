import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap, catchError, throwError } from 'rxjs';
import { AuthentificationService } from '../Authentification/authentification.service';

export interface LiveKitRoom {
  room_name: string;
  description: string;
  maxParticipants: number;
  isPrivate: boolean;
  type?: string;
  title?: string;
  organizer?: string;
  emptyTimeout?: number;
}

export interface JoinSessionResponse {
  accessToken?: string;
  token?: string;
  joinUrl?: string;
  room?: {
    sid: string;
    name: string;
    emptyTimeout: number;
    maxParticipants: number;
    creationTime: string;
    turnPassword: string;
    enabledCodecs: Array<{ mime: string }>;
    metadata: string;
    numParticipants: number;
    activeRecording: boolean;
  };
  message?: string;
}

export interface RoomInfo {
  sid: string;
  name: string;
  emptyTimeout: number;
  maxParticipants: number;
  creationTime: string;
  numParticipants: number;
  metadata: {
    description: string;
    isPrivate: boolean;
    title?: string;
    type?: string;
    organizer?: string;
    room_name?: string;
  };
  isActive: boolean;
  isJoined?: boolean;
  isOrganizer?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MeetingFormateurService {

  private apiUrl = 'http://127.0.0.1:8000/api';
  
  private roomsSubject = new BehaviorSubject<RoomInfo[]>([]);
  public rooms$ = this.roomsSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private authService: AuthentificationService
  ) {}

  /** 🔹 Générer les headers avec JWT */
  private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  }

  /** 🔹 Créer une salle LiveKit */
  createRoom(roomData: LiveKitRoom): Observable<any> {
    console.log('Données envoyées pour création de salle:', roomData);
    
    return this.http.post<any>(
      `${this.apiUrl}/livekit/rooms`, 
      roomData, 
      this.getHeaders()
    ).pipe(
      tap((response) => {
        console.log('Réponse création salle:', response);
        setTimeout(() => this.loadRooms(), 1000);
      }),
      catchError(error => {
        console.error('Erreur création salle:', error);
        return throwError(() => error);
      })
    );
  }

  /** 🔹 Créer une salle avec options complètes */
  createRoomWithOptions(roomData: {
    name: string;
    emptyTimeout?: number;
    maxParticipants?: number;
    metadata?: any;
    isPrivate?: boolean;
    type?: string;
    title?: string;
    description?: string;
    organizer?: string;
  }): Observable<any> {
    const formattedData: LiveKitRoom = {
      room_name: roomData.name,
      description: roomData.description || '',
      maxParticipants: roomData.maxParticipants || 50,
      isPrivate: roomData.isPrivate || false,
      type: roomData.type || 'meeting',
      title: roomData.title || roomData.name,
      organizer: roomData.organizer || 'Utilisateur',
      emptyTimeout: roomData.emptyTimeout || 3600
    };
    
    return this.createRoom(formattedData);
  }

  /** 🔹 Lister toutes les salles LiveKit */
  getRooms(): Observable<RoomInfo[]> {
    return this.http.get<any>(`${this.apiUrl}/livekit/rooms`, this.getHeaders()).pipe(
      map(response => {
        console.log('Réponse API brute pour getRooms:', response);
        
        if (response && response.rooms && Array.isArray(response.rooms)) {
          return this.formatRoomsResponse(response.rooms);
        }
        
        if (Array.isArray(response)) {
          return this.formatRoomsResponse(response);
        }
        
        if (response && typeof response === 'object') {
          return this.formatRoomsResponse([response]);
        }
        
        console.warn('Format de réponse inattendu:', response);
        return [];
      }),
      tap(rooms => {
        console.log('Salles formatées:', rooms);
        this.roomsSubject.next(rooms);
      }),
      catchError(error => {
        console.error('Erreur getRooms:', error);
        return throwError(() => error);
      })
    );
  }

  /** 🔹 Formater la réponse des salles */
  private formatRoomsResponse(rooms: any[]): RoomInfo[] {
    return rooms.map(room => {
      let metadata: any;
      if (typeof room.metadata === 'string') {
        try {
          metadata = JSON.parse(room.metadata);
        } catch (e) {
          metadata = {};
        }
      } else {
        metadata = room.metadata || {};
      }
      
      return {
        sid: room.sid || room.name,
        name: room.name,
        emptyTimeout: room.emptyTimeout || 3600,
        maxParticipants: room.maxParticipants || 50,
        creationTime: room.creationTime || new Date().toISOString(),
        numParticipants: room.numParticipants || 0,
        metadata: {
          description: metadata.description || room.description || '',
          isPrivate: metadata.isPrivate || false,
          title: metadata.title || room.title || room.name,
          type: metadata.type || 'meeting',
          organizer: metadata.organizer || 'Inconnu',
          room_name: metadata.room_name || room.name
        },
        isActive: room.numParticipants > 0 || room.isActive || false
      };
    });
  }

  /** 🔹 Charger les salles (méthode simplifiée) */
  loadRooms(): void {
    this.getRooms().subscribe({
      error: (error) => console.error('Erreur chargement salles:', error)
    });
  }

  /** 🔹 Obtenir les salles disponibles (publiques et non pleines) */
  getAvailableRooms(): Observable<RoomInfo[]> {
    return this.getRooms().pipe(
      map(rooms => {
        return rooms.filter(room => {
          const isAvailable = 
            !room.metadata.isPrivate && 
            room.numParticipants < room.maxParticipants;
          
          const joinedRooms = JSON.parse(localStorage.getItem('joined-livekit-rooms') || '[]');
          const isUserJoined = joinedRooms.includes(room.name);
          
          return isAvailable || isUserJoined;
        });
      })
    );
  }

  /** 🔹 Rejoindre une salle - CORRIGÉ avec la route /livekit/sessions/join */
  joinRoom(roomName: string, participantName: string): Observable<string> {
    return new Observable(observer => {
      const body = {
        room_name: roomName,
        participant_name: participantName,
        role: 'participant'
      };

      console.log('Envoi de la requête pour rejoindre:', {
        url: `${this.apiUrl}/livekit/sessions/join`,
        body: body,
        headers: this.getHeaders()
      });

      this.http.post<JoinSessionResponse>(
        `${this.apiUrl}/livekit/sessions/join`,
        body,
        this.getHeaders()
      ).subscribe({
        next: (response) => {
          console.log('Réponse de /livekit/sessions/join:', response);
          
          // Si la réponse contient directement l'URL de connexion
          if (response.joinUrl) {
            console.log('URL directe reçue:', response.joinUrl);
            observer.next(response.joinUrl);
          }
          // Si la réponse contient un token, construire l'URL
          else if (response.accessToken || response.token) {
            const token = response.accessToken || response.token;
            const joinUrl = this.generateJoinUrl(roomName, token!);
            console.log('URL construite avec token:', joinUrl);
            observer.next(joinUrl);
          }
          // Si la réponse est un token direct (string)
          else if (typeof response === 'string') {
            const joinUrl = this.generateJoinUrl(roomName, response);
            observer.next(joinUrl);
          }
          else {
            console.error('Format de réponse inattendu:', response);
            observer.error(new Error('Format de réponse inattendu de l\'API'));
          }
          
          observer.complete();
        },
        error: (error) => {
          console.error('Erreur lors de la jonction:', {
            status: error.status,
            message: error.message,
            error: error.error
          });
          
          let errorMessage = 'Impossible de rejoindre la salle.';
          
          if (error.status === 422) {
            errorMessage = 'Erreur de validation. Vérifiez que la salle existe.';
          } else if (error.status === 404) {
            errorMessage = 'Salle non trouvée.';
          } else if (error.status === 401) {
            errorMessage = 'Vous devez être connecté pour rejoindre une salle.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          observer.error(new Error(errorMessage));
        }
      });
    });
  }

  /** 🔹 Rejoindre une salle directement (retourne l'objet complet) */
  joinRoomDirect(roomName: string, participantName: string): Observable<{ joinUrl: string }> {
    return new Observable(observer => {
      this.joinRoom(roomName, participantName).subscribe({
        next: (joinUrl) => {
          observer.next({ joinUrl });
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /** 🔹 Générer l'URL de jonction LiveKit - CORRIGÉ */
  private generateJoinUrl(roomName: string, token: string): string {
    const liveKitUrl = 'https://meet.livekit.io';
    
    // Options de configuration pour LiveKit - converties en chaînes
    const options = {
      videoEnabled: 'true',
      audioEnabled: 'true',
      simulcast: 'true',
      adaptiveStream: 'true',
      dynacast: 'true'
    };
    
    // Construire les paramètres d'URL
    const params = new URLSearchParams({
      token: token,
      ...options
    });
    
    return `${liveKitUrl}/#/${roomName}?${params.toString()}`;
  }

  /** 🔹 Formater l'URL de la réunion pour partage */
  getShareableUrl(roomName: string): string {
    return `${window.location.origin}/join/${roomName}`;
  }

  /** 🔹 Supprimer une salle LiveKit */
  deleteRoom(roomName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/livekit/rooms/${roomName}`, this.getHeaders()).pipe(
      tap(() => {
        const currentRooms = this.roomsSubject.value.filter(room => room.name !== roomName);
        this.roomsSubject.next(currentRooms);
      }),
      catchError(error => {
        console.error('Erreur suppression:', error);
        return throwError(() => error);
      })
    );
  }

  /** 🔹 Tester la connexion à l'API */
  testConnection(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/livekit/test`, this.getHeaders()).pipe(
      catchError(error => {
        console.error('Erreur test connection:', error);
        return throwError(() => error);
      })
    );
  }

  /** 🔹 Obtenir le statut de LiveKit */
  getLiveKitStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/livekit/status`, this.getHeaders()).pipe(
      catchError(error => {
        console.error('Erreur statut LiveKit:', error);
        return throwError(() => error);
      })
    );
  }

  /** 🔹 Obtenir une salle spécifique */
  getRoom(roomName: string): Observable<RoomInfo> {
    return this.http.get<any>(`${this.apiUrl}/livekit/rooms/${roomName}/info`, this.getHeaders()).pipe(
      map(room => this.formatSingleRoomResponse(room)),
      catchError(error => {
        console.error('Erreur getRoom:', error);
        return throwError(() => error);
      })
    );
  }

  /** 🔹 Formater une seule salle */
  private formatSingleRoomResponse(room: any): RoomInfo {
    let metadata: any;
    if (typeof room.metadata === 'string') {
      try {
        metadata = JSON.parse(room.metadata);
      } catch (e) {
        metadata = {};
      }
    } else {
      metadata = room.metadata || {};
    }
    
    return {
      sid: room.sid || room.name,
      name: room.name,
      emptyTimeout: room.emptyTimeout || 3600,
      maxParticipants: room.maxParticipants || 50,
      creationTime: room.creationTime || new Date().toISOString(),
      numParticipants: room.numParticipants || 0,
      metadata: {
        description: metadata.description || room.description || '',
        isPrivate: metadata.isPrivate || false,
        title: metadata.title || room.title || room.name,
        type: metadata.type || 'meeting',
        organizer: metadata.organizer || 'Inconnu',
        room_name: metadata.room_name || room.name
      },
      isActive: room.numParticipants > 0 || room.isActive || false
    };
  }

  /** 🔹 Créer une session one-on-one (si disponible) - CORRIGÉ */
  createOneOnOneCall(participantId: string): Observable<any> {
    const userId = this.authService.getUserId();
    const body = {
      participant_id: participantId,
      caller_id: userId
    };
    
    return this.http.post<any>(`${this.apiUrl}/livekit/sessions/one-on-one`, body, this.getHeaders());
  }

  /** 🔹 Créer une session de cours - CORRIGÉ */
  createCourseSession(courseId: string, title?: string): Observable<any> {
    const organizer = this.authService.getUserName();
    const body = {
      course_id: courseId,
      title: title || `Session de cours ${courseId}`,
      organizer: organizer || 'Organisateur'
    };
    
    return this.http.post<any>(`${this.apiUrl}/livekit/sessions/course`, body, this.getHeaders());
  }

  /** 🔹 Essayer de rejoindre via l'API de session - CORRIGÉ */
  private tryJoinViaSessionApi(roomName: string, participantName: string): Observable<string> {
    return new Observable(observer => {
      const userId = this.authService.getUserId();
      const sessionBody = {
        room_name: roomName,
        participant_name: participantName,
        user_id: userId
      };
      
      console.log('Essai via API session:', sessionBody);
      
      this.http.post<any>(`${this.apiUrl}/livekit/sessions/join`, sessionBody, this.getHeaders()).subscribe({
        next: (response) => {
          console.log('Réponse session:', response);
          if (response.joinUrl || response.accessToken) {
            const joinUrl = response.joinUrl || this.generateJoinUrl(roomName, response.accessToken);
            observer.next(joinUrl);
            observer.complete();
          } else {
            observer.error(new Error('Réponse de session invalide'));
          }
        },
        error: (error) => {
          console.error('Erreur session:', error);
          observer.error(error);
        }
      });
    });
  }
}