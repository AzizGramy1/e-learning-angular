import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createLocalTracks, RemoteParticipant, Room, RoomEvent, Track } from 'livekit-client';
import { LivekitService } from 'src/app/Service/LiveKit/livekit.service';

@Component({
  selector: 'app-video-callcomponent',
  templateUrl: './video-callcomponent.component.html',
  styleUrls: ['./video-callcomponent.component.scss']
})
export class VideoCallcomponentComponent implements OnInit, OnDestroy {

  @ViewChild('chatMessages') chatMessagesContainer!: ElementRef;

  // Données de la salle
  roomName: string = '';
  participantName: string = '';
  role: string = 'participant';
  
  // État de l'application
  isConnected: boolean = false;
  isCallActive: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  meetingTime: string = '00:00:00';
  
  // Contrôles média
  micEnabled: boolean = true;
  videoEnabled: boolean = true;
  screenSharing: boolean = false;
  
  // Interface
  showChat: boolean = true;
  showParticipants: boolean = true;
  unreadMessages: number = 0;
  
  // Chat
  chatMessages: any[] = [];
  newMessage: string = '';
  
  // Participants
  participants: RemoteParticipant[] = [];

  // Variables privées
  private session: Room | null = null;
  private localTracks: Track[] = [];
  private startTime: Date = new Date();
  private timerInterval: any;

  constructor(
    private liveKitService: LivekitService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    // Récupérer les paramètres de route
    this.route.queryParams.subscribe(params => {
      this.roomName = params['roomName'] || 'Session sans nom';
      this.participantName = params['participantName'] || 'Utilisateur';
      this.role = params['role'] || 'participant';
    });

    await this.initializeMeeting();
  }

  // Initialiser la réunion
  private async initializeMeeting(): Promise<void> {
    this.isLoading = true;
    
    try {
      console.log('🚀 Initialisation de la réunion...');
      
      // Obtenir la session LiveKit
      const liveKitSession = await this.liveKitService.createAndJoinRoom(
        this.roomName, 
        this.participantName,
        10
      );

      if (!liveKitSession?.token || !liveKitSession?.ws_url) {
        throw new Error('Impossible d\'obtenir les informations de connexion');
      }

      // Initialiser la room LiveKit
      this.session = new Room();
      this.setupRoomEvents();

      // Se connecter
      await this.session.connect(liveKitSession.ws_url, liveKitSession.token);
      
      // Démarrer les médias locaux
      await this.startLocalMedia();
      
      this.isConnected = true;
      this.isCallActive = true;
      this.startTimer();
      
      console.log('✅ Réunion initialisée avec succès');

    } catch (error: any) {
      console.error('❌ Erreur d\'initialisation:', error);
      this.errorMessage = error.message || 'Erreur de connexion';
    } finally {
      this.isLoading = false;
    }
  }

  // Démarrer caméra et micro
  private async startLocalMedia(): Promise<void> {
    try {
      const tracks = await createLocalTracks({
        audio: true,
        video: true
      });

      this.localTracks = tracks;

      // Publier les tracks dans la room
      for (const track of tracks) {
        await this.session!.localParticipant.publishTrack(track);
      }

      // Afficher la vidéo locale
      this.updateLocalVideo();
      
    } catch (error: any) {
      console.warn('⚠️ Impossible d\'accéder aux médias:', error);
      
      if (error.name === 'NotAllowedError') {
        this.errorMessage = 'Permission caméra/micro refusée';
      } else if (error.name === 'NotFoundError') {
        this.errorMessage = 'Aucune caméra/micro détecté';
      } else {
        this.errorMessage = 'Erreur d\'accès aux médias';
      }
    }
  }

  // Configurer les événements de la room
  private setupRoomEvents(): void {
    if (!this.session) return;

    this.session
      .on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        console.log('👤 Participant connecté:', participant.identity);
        this.addParticipant(participant);
      })
      .on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        console.log('👤 Participant déconnecté:', participant.identity);
        this.removeParticipant(participant);
      })
      .on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === 'video') {
          this.attachRemoteVideo(track, participant);
        }
      })
      .on(RoomEvent.Disconnected, () => {
        console.log('🔴 Déconnecté de la room');
        this.cleanup();
      });
  }

  // Gestion des participants
  private addParticipant(participant: RemoteParticipant): void {
    if (!this.participants.find(p => p.identity === participant.identity)) {
      this.participants.push(participant);
    }
  }

  private removeParticipant(participant: RemoteParticipant): void {
    this.participants = this.participants.filter(p => p.identity !== participant.identity);
    this.removeParticipantVideo(participant.identity);
  }

  // Gestion vidéo des participants distants
  private attachRemoteVideo(track: any, participant: RemoteParticipant): void {
    const elementId = `video-${participant.identity}`;
    let videoElement = document.getElementById(elementId) as HTMLVideoElement;
    
    if (!videoElement) {
      videoElement = document.createElement('video');
      videoElement.id = elementId;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.muted = false;
      videoElement.className = 'thumbnail-video';
      
      const thumbnailDiv = document.createElement('div');
      thumbnailDiv.className = 'thumbnail-item';
      thumbnailDiv.id = `thumbnail-${participant.identity}`;
      
      thumbnailDiv.innerHTML = `
        <div class="thumbnail-overlay">
          <span class="thumbnail-name">${participant.identity}</span>
          <div class="participant-status">
            <i class="fas fa-microphone" style="color: var(--secondary);"></i>
          </div>
        </div>
      `;
      
      thumbnailDiv.appendChild(videoElement);
      document.getElementById('participantThumbnails')?.appendChild(thumbnailDiv);
    }
    
    track.attach(videoElement);
  }

  private removeParticipantVideo(participantId: string): void {
    const thumbnail = document.getElementById(`thumbnail-${participantId}`);
    if (thumbnail) thumbnail.remove();
  }

  // Mettre à jour la vidéo locale
  private updateLocalVideo(): void {
    if (!this.session) return;

    const streamContent = document.getElementById('streamContent');
    if (!streamContent) return;

    // Vider le contenu
    streamContent.innerHTML = '';

    if (!this.videoEnabled) {
      // Afficher un placeholder si caméra désactivée
      streamContent.innerHTML = `
        <i class="fas fa-video-slash" style="font-size: 4rem; color: var(--primary);"></i>
        <div class="stream-info">
          <h2>Caméra désactivée</h2>
          <p>Votre caméra est actuellement désactivée</p>
        </div>
      `;
      return;
    }

    // Chercher et attacher la track vidéo locale
    const videoTracks = Array.from(this.session.localParticipant.videoTracks.values());
    
    if (videoTracks.length > 0 && videoTracks[0].track) {
      const videoElement = videoTracks[0].track.attach();
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.objectFit = 'cover';
      videoElement.muted = true;
      streamContent.appendChild(videoElement);
    }
  }

  // 🔇 TOGGLE MICRO
  async toggleAudio(): Promise<void> {
    if (!this.session || this.isLoading) return;

    try {
      this.micEnabled = !this.micEnabled;
      
      if (this.micEnabled) {
        await this.session.localParticipant.setMicrophoneEnabled(true);
        console.log('🎤 Micro activé');
      } else {
        await this.session.localParticipant.setMicrophoneEnabled(false);
        console.log('🔇 Micro désactivé');
      }
      
    } catch (error) {
      console.error('❌ Erreur micro:', error);
      this.micEnabled = !this.micEnabled; // Revert change
      this.errorMessage = 'Erreur de contrôle du micro';
    }
  }

  // 📹 TOGGLE CAMÉRA
  async toggleVideo(): Promise<void> {
    if (!this.session || this.isLoading) return;

    try {
      this.videoEnabled = !this.videoEnabled;
      
      if (this.videoEnabled) {
        await this.session.localParticipant.setCameraEnabled(true);
        console.log('📹 Caméra activée');
      } else {
        await this.session.localParticipant.setCameraEnabled(false);
        console.log('📹 Caméra désactivée');
      }
      
      // Mettre à jour l'affichage vidéo
      this.updateLocalVideo();
      
    } catch (error) {
      console.error('❌ Erreur caméra:', error);
      this.videoEnabled = !this.videoEnabled; // Revert change
      this.errorMessage = 'Erreur de contrôle de la caméra';
    }
  }

  // 🖥️ Partage d'écran
  async toggleScreenShare(): Promise<void> {
    if (!this.session || this.isLoading) return;

    try {
      this.screenSharing = !this.screenSharing;
      
      if (this.screenSharing) {
        await this.session.localParticipant.setScreenShareEnabled(true);
        console.log('🖥️ Partage d\'écran activé');
      } else {
        await this.session.localParticipant.setScreenShareEnabled(false);
        console.log('🖥️ Partage d\'écran désactivé');
      }
      
    } catch (error) {
      console.error('❌ Erreur partage écran:', error);
      this.screenSharing = !this.screenSharing;
      this.errorMessage = 'Erreur de partage d\'écran';
    }
  }

  // 💬 Chat
  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  toggleParticipants(): void {
    this.showParticipants = !this.showParticipants;
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const message = {
      sender: this.participantName,
      text: this.newMessage,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    this.chatMessages.push(message);
    this.newMessage = '';
    
    // Scroll to bottom
    setTimeout(() => {
      if (this.chatMessagesContainer) {
        this.chatMessagesContainer.nativeElement.scrollTop = 
          this.chatMessagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  // ⏱️ Timer
  private startTimer(): void {
    this.startTime = new Date();
    
    this.timerInterval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - this.startTime.getTime();
      
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      this.meetingTime = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  // 🚪 Quitter l'appel
  async leaveCall(): Promise<void> {
    try {
      if (this.session) {
        await this.session.disconnect();
      }
      this.cleanup();
      this.router.navigate(['/rooms']);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  // 🧹 Nettoyage
  private cleanup(): void {
    // Arrêter le timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Arrêter les tracks locaux
    this.localTracks.forEach(track => {
      try {
        track.stop();
      } catch (error) {
        console.warn('Erreur arrêt track:', error);
      }
    });
    this.localTracks = [];

    // Nettoyer la session
    if (this.session) {
      this.session.removeAllListeners();
      this.session = null;
    }

    this.isConnected = false;
    this.isCallActive = false;
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}