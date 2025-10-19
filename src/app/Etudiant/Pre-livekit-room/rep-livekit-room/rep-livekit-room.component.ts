import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsServiceService, Room } from 'src/app/Service/Rooms/rooms-service.service';
import { LivekitService } from 'src/app/Service/LiveKit/livekit.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-rep-livekit-room',
  templateUrl: './rep-livekit-room.component.html',
  styleUrls: ['./rep-livekit-room.component.scss']
})
export class RepLivekitRoomComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;

  // Données de la salle
  roomId: string = '';
  roomData: Room | null = null;
  roomName: string = '';
  roomDescription: string = '';
  maxParticipants: number = 10;
  token: string = '';
  currentParticipants: number = 0;
  roomTopic: string = '';
  roomHost: string = 'Système';

  // État des médias
  isVideoEnabled: boolean = true;
  isAudioEnabled: boolean = true;
  isConnected: boolean = false;
  loading: boolean = false;
  error: string = '';

  // Paramètres utilisateur
  participantName: string = '';

  // Paramètres techniques
  hasMultipleCameras: boolean = false;
  currentCamera: string = '';
  enableNoiseSuppression: boolean = true;
  enableEchoCancellation: boolean = true;
  videoQuality: string = 'high';

  // Métriques calculées
  occupancyRate: number = 0;
  availableSpots: number = 0;

  private localStream: MediaStream | null = null;
  private cameras: MediaDeviceInfo[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomsServiceService,
    private livekitService: LivekitService
  ) {}

  ngOnInit(): void {
    this.getRouteParams();
    this.checkConnection();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeMedia();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupMedia();
  }

  private getRouteParams(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.roomId = params['room'] || '';
        this.token = params['token'] || '';
        this.participantName = params['participant'] || 'Utilisateur';
        this.roomName = params['roomName'] || '';
        this.roomDescription = params['roomDescription'] || '';
        this.roomTopic = params['topic'] || '';
        this.maxParticipants = parseInt(params['maxParticipants']) || 10;

        console.log('📋 Paramètres reçus:', {
          roomId: this.roomId,
          roomName: this.roomName,
          participantName: this.participantName,
          maxParticipants: this.maxParticipants
        });

        if (this.roomId) {
          this.loadRoomData();
        } else if (this.roomName) {
          this.setDefaultRoomData();
        }
      });
  }

  private loadRoomData(): void {
    this.loading = true;
    const roomIdentifier = this.roomId;

    console.log('🔄 Chargement des données de la salle:', roomIdentifier);

    this.roomService.rooms$
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe({
        next: (rooms) => {
          console.log('📦 Liste des salles reçue:', rooms);
          
          const roomFromList = this.findRoomInList(rooms, roomIdentifier);
          
          if (roomFromList) {
            console.log('✅ Salle trouvée dans la liste:', roomFromList);
            this.setRoomData(roomFromList);
            this.loading = false;
          } else {
            console.log('🔍 Salle non trouvée dans la liste, chargement depuis l\'API...');
            this.loadRoomFromAPI(roomIdentifier);
          }
        },
        error: (error) => {
          console.error('❌ Erreur lors du chargement de la liste des salles:', error);
          this.loadRoomFromAPI(roomIdentifier);
        }
      });
  }

  private findRoomInList(rooms: any[], roomIdentifier: string): Room | null {
    return rooms.find(room => 
      room.id?.toString() === roomIdentifier || 
      room.room_name === roomIdentifier ||
      room.sid === roomIdentifier
    ) || null;
  }

  private loadRoomFromAPI(roomIdentifier: string): void {
    const roomIdNumber = parseInt(roomIdentifier, 10);
    
    if (!isNaN(roomIdNumber)) {
      this.loadRoomById(roomIdNumber);
    } else {
      this.loadRoomByName(roomIdentifier);
    }
  }

  private loadRoomById(roomId: number): void {
    this.roomService.getRoomById(roomId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (room) => {
          console.log('✅ Données de salle chargées depuis l\'API:', room);
          this.setRoomData(room);
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Erreur chargement salle par ID:', error);
          this.handleRoomLoadError(error, 'Impossible de charger les données de la salle');
        }
      });
  }

  private loadRoomByName(roomName: string): void {
    this.roomService.getRooms()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rooms) => {
          const foundRoom = rooms.find(room => 
            room.room_name === roomName
          );
          if (foundRoom) {
            console.log('✅ Salle trouvée après rechargement:', foundRoom);
            this.setRoomData(foundRoom);
          } else {
            console.warn('❌ Salle non trouvée:', roomName);
            this.setDefaultRoomData();
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Erreur chargement des salles:', error);
          this.handleRoomLoadError(error, 'Impossible de charger la liste des salles');
        }
      });
  }

  private handleRoomLoadError(error: any, message: string): void {
    this.error = message;
    this.setDefaultRoomData();
    this.loading = false;
    
    if (error.status === 404) {
      console.warn('🔍 Salle non trouvée sur le serveur');
    } else if (error.status === 401) {
      console.warn('🔐 Authentification requise');
      this.error = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.status === 403) {
      console.warn('🚫 Accès non autorisé');
      this.error = 'Accès non autorisé à cette salle.';
    }
  }

  private setRoomData(room: Room): void {
    this.roomData = room;
    this.roomName = room.room_name || this.roomName || 'Salle sans nom';
    this.roomDescription = room.description || this.roomDescription || '';
    this.maxParticipants = room.maxParticipants || this.maxParticipants || 10;
    this.currentParticipants = room.participants || 0;
    this.roomTopic = room.topic || this.roomTopic || '';
    this.roomHost = room.host || 'Système';

    this.calculateRoomMetrics();

    console.log('🎯 Données de salle mises à jour:', {
      roomName: this.roomName,
      participants: `${this.currentParticipants}/${this.maxParticipants}`
    });
  }

  private setDefaultRoomData(): void {
    this.roomName = this.roomName || 'Salle sans nom';
    this.roomDescription = this.roomDescription || '';
    this.maxParticipants = this.maxParticipants || 10;
    this.currentParticipants = 0;
    this.roomTopic = this.roomTopic || '';
    this.roomHost = 'Système';
    this.calculateRoomMetrics();
    
    console.log('⚙️ Données par défaut appliquées');
  }

  private calculateRoomMetrics(): void {
    if (this.maxParticipants > 0) {
      this.occupancyRate = Math.round((this.currentParticipants / this.maxParticipants) * 100);
    } else {
      this.occupancyRate = 0;
    }

    this.availableSpots = Math.max(0, this.maxParticipants - this.currentParticipants);
  }

  getOccupancyClass(): string {
    if (this.occupancyRate < 50) return 'low';
    if (this.occupancyRate < 80) return 'medium';
    return 'high';
  }

  getRoomDuration(): string {
    if (this.roomData?.createdAt) {
      try {
        const created = new Date(this.roomData.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - created.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffHours > 0) {
          return `En cours depuis ${diffHours}h${diffMins % 60}min`;
        } else if (diffMins > 0) {
          return `En cours depuis ${diffMins}min`;
        } else {
          return 'Nouvelle session';
        }
      } catch (error) {
        return 'Nouvelle session';
      }
    }
    return 'Nouvelle session';
  }

  // 🚀 MÉTHODE PRINCIPALE : Rejoindre la salle de meeting - CORRIGÉE
  async joinMeeting(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      console.log('🚀 Tentative de connexion à la salle:', {
        roomName: this.roomName,
        participantName: this.participantName,
        maxParticipants: this.maxParticipants
      });

      // 1. Générer le token via LiveKit Service - CORRECTION : 3 arguments
      const session = await this.livekitService.createAndJoinRoom(
        this.roomName,
        this.participantName,
        this.maxParticipants
      );

      console.log('🔑 Session LiveKit créée:', session);

      if (!session || !session.token) {
        throw new Error('Erreur lors de la génération du token LiveKit');
      }

      console.log('✅ Token généré avec succès');

      // 2. Préparer les paramètres pour la redirection
      const queryParams = {
        roomName: this.roomName,
        participantName: this.participantName,
        role: 'participant',
        roomDescription: this.roomDescription,
        topic: this.roomTopic,
        maxParticipants: this.maxParticipants.toString()
      };

      console.log('📤 Redirection vers meeting avec:', queryParams);

      // 3. Rediriger vers le composant meeting
      this.router.navigate(['/Etudiant/Reunion/VideoCall'], { queryParams });

    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion:', error);
      this.error = `Erreur de connexion: ${error.message || 'Erreur inconnue'}`;
      this.loading = false;
    }
  }

  async initializeMedia(): Promise<void> {
    try {
      this.error = '';
      this.loading = true;
      await this.getAvailableCameras();
      await this.startMediaStream();
      this.isConnected = true;
    } catch (err) {
      console.error('Erreur lors de l\'initialisation des médias:', err);
      this.handleMediaError(err);
    } finally {
      this.loading = false;
    }
  }

  private async getAvailableCameras(): Promise<void> {
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.cameras = devices.filter(device => device.kind === 'videoinput');
      this.hasMultipleCameras = this.cameras.length > 1;
      
      if (this.cameras.length > 0) {
        this.currentCamera = this.cameras[0].deviceId;
      }
      
      tempStream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Erreur lors de la récupération des caméras:', err);
    }
  }

  private async startMediaStream(): Promise<void> {
    this.cleanupMedia();

    const constraints: MediaStreamConstraints = {
      video: this.isVideoEnabled ? {
        deviceId: this.currentCamera ? { ideal: this.currentCamera } : undefined,
        width: { ideal: 1280, min: 640 },
        height: { ideal: 720, min: 480 },
        frameRate: { ideal: 24, min: 15 }
      } : false,
      audio: this.isAudioEnabled ? {
        echoCancellation: { ideal: this.enableEchoCancellation },
        noiseSuppression: { ideal: this.enableNoiseSuppression },
        autoGainControl: { ideal: true }
      } : false
    };

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (this.localVideo && this.localVideo.nativeElement) {
        this.localVideo.nativeElement.srcObject = this.localStream;
        
        this.localVideo.nativeElement.onloadedmetadata = () => {
          console.log('Vidéo chargée avec succès');
        };
        
        this.localVideo.nativeElement.onerror = (error) => {
          console.error('Erreur vidéo:', error);
        };
      } else {
        console.error('Élément video non trouvé');
      }
    } catch (err) {
      console.error('Erreur accès média:', err);
      throw err;
    }
  }

  private handleMediaError(err: any): void {
    if (err.name === 'OverconstrainedError') {
      this.error = 'Configuration non supportée. Tentative avec paramètres réduits...';
      setTimeout(() => this.startFallbackMediaStream(), 1000);
    } else if (err.name === 'NotAllowedError') {
      this.error = 'Accès à la caméra/micro refusé. Vérifiez les permissions du navigateur.';
    } else if (err.name === 'NotFoundError') {
      this.error = 'Aucune caméra/micro disponible.';
    } else {
      this.error = `Erreur d'accès média: ${err.message || 'Erreur inconnue'}`;
    }
    this.isConnected = false;
  }

  private async startFallbackMediaStream(): Promise<void> {
    try {
      const fallbackConstraints: MediaStreamConstraints = {
        video: this.isVideoEnabled ? {
          width: { min: 320, ideal: 640 },
          height: { min: 240, ideal: 480 }
        } : false,
        audio: this.isAudioEnabled ? true : false
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      
      if (this.localVideo && this.localVideo.nativeElement) {
        this.localVideo.nativeElement.srcObject = this.localStream;
        this.error = '';
        this.isConnected = true;
      }
    } catch (fallbackErr) {
      console.error('Échec même avec fallback:', fallbackErr);
      this.error = 'Impossible d\'accéder aux périphériques média.';
    }
  }

  async toggleVideo(): Promise<void> {
    this.isVideoEnabled = !this.isVideoEnabled;
    
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = this.isVideoEnabled;
      }
    }

    if (this.isVideoEnabled && !this.localStream?.getVideoTracks().length) {
      await this.startMediaStream();
    }
  }

  async toggleAudio(): Promise<void> {
    this.isAudioEnabled = !this.isAudioEnabled;
    
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = this.isAudioEnabled;
      }
    }

    if (this.isAudioEnabled && !this.localStream?.getAudioTracks().length) {
      await this.startMediaStream();
    }
  }

  async switchCamera(): Promise<void> {
    if (this.cameras.length < 2) return;

    const currentIndex = this.cameras.findIndex(cam => 
      cam.deviceId === this.currentCamera
    );
    
    const nextIndex = (currentIndex + 1) % this.cameras.length;
    this.currentCamera = this.cameras[nextIndex].deviceId;

    await this.startMediaStream();
  }

  updateAudioSettings(): void {
    if (this.localStream && this.isAudioEnabled) {
      this.startMediaStream();
    }
  }

  updateVideoSettings(): void {
    if (this.localStream && this.isVideoEnabled) {
      this.startMediaStream();
    }
  }

  private checkConnection(): void {
    setTimeout(() => {
      this.isConnected = true;
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/rooms']);
  }

  private cleanupMedia(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }
  }
}