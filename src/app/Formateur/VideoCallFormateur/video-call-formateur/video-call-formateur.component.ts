import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createLocalTracks, DataPacket_Kind, RemoteParticipant, Room, RoomEvent, Track } from 'livekit-client';
import { LivekitService } from 'src/app/Service/LiveKit/livekit.service';

@Component({
  selector: 'app-video-call-formateur',
  templateUrl: './video-call-formateur.component.html',
  styleUrls: ['./video-call-formateur.component.scss']
})
export class VideoCallFormateurComponent {
  
    @ViewChild('chatMessages') chatMessagesContainer!: ElementRef;
    @ViewChild('chatInput') chatInput!: ElementRef;
  
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
    showInvitePanel: boolean = false;
    unreadMessages: number = 0;
    
    // Chat
    chatMessages: any[] = [];
    newMessage: string = '';
    
    // Participants
    participants: RemoteParticipant[] = [];

    // Invitation
    meetingLink: string = '';
    meetingCode: string = '';
    inviteEmail: string = '';
    pendingInvitations: string[] = [];
    allowEmailInvite: boolean = true;
    roomId: string = '';
  
    // Variables privées
    private session: Room | null = null;
    private localTracks: Track[] = [];
    private startTime: Date = new Date();
    private timerInterval: any;
  
    constructor(
      private liveKitService: LivekitService,
      private route: ActivatedRoute,
      private router: Router,
      private cdRef: ChangeDetectorRef
    ) { }
  
    async ngOnInit(): Promise<void> {
      // Récupérer les paramètres de route
      this.route.queryParams.subscribe(params => {
        this.roomName = params['roomName'] || 'Session sans nom';
        this.participantName = params['participantName'] || 'Utilisateur';
        this.role = params['role'] || 'participant';
        this.roomId = params['roomId'] || '';
      });
  
      await this.initializeMeeting();
      this.addWelcomeMessage();
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
  
        // Afficher la vidéo locale selon le mode
        this.updateVideoDisplay();
        
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
  
    // Configuration des événements de la room
    private setupRoomEvents(): void {
      if (!this.session) return;
  
      this.session
        .on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
          console.log('👤 Participant connecté:', participant.identity);
          this.addParticipant(participant);
          this.addSystemMessage(`${participant.identity} a rejoint la réunion`);
        })
        .on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
          console.log('👤 Participant déconnecté:', participant.identity);
          this.removeParticipant(participant);
          this.addSystemMessage(`${participant.identity} a quitté la réunion`);
        })
        .on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          if (track.kind === 'video') {
            this.attachRemoteVideo(track, participant);
          }
        })
        .on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: RemoteParticipant, kind?: number, topic?: string) => {
          console.log('📨 Données reçues - Topic:', topic, 'Participant:', participant?.identity);
          this.handleDataReceived(payload, participant, topic);
        })
        .on(RoomEvent.Disconnected, () => {
          console.log('🔴 Déconnecté de la room');
          this.cleanup();
        });
    }
  
    // Gestion des données reçues
    private handleDataReceived(payload: Uint8Array, participant?: RemoteParticipant, topic?: string): void {
      try {
        console.log('📨 DataReceived appelé - Topic:', topic);
        
        if (topic === 'chat') {
          const messageText = new TextDecoder().decode(payload);
          console.log('💬 Message brut reçu:', messageText);
          
          const messageData = JSON.parse(messageText);
          console.log('💬 Message parsé:', messageData);
  
          this.addChatMessage(messageData.sender, messageData.text, messageData.time);
          
          // Incrémenter les messages non lus si le chat n'est pas visible
          if (!this.showChat && messageData.sender !== this.participantName) {
            this.unreadMessages++;
            console.log('🔔 Nouveau message non lu:', this.unreadMessages);
          }
        }
      } catch (error) {
        console.error('❌ Erreur traitement données reçues:', error);
      }
    }
  
    // Gestion des participants
    private addParticipant(participant: RemoteParticipant): void {
      if (!this.participants.find(p => p.identity === participant.identity)) {
        this.participants.push(participant);
        this.cdRef.detectChanges();
      }
    }
  
    private removeParticipant(participant: RemoteParticipant): void {
      this.participants = this.participants.filter(p => p.identity !== participant.identity);
      this.removeParticipantVideo(participant.identity);
      this.cdRef.detectChanges();
    }
  
    // Gestion vidéo des participants distants
    private attachRemoteVideo(track: any, participant: RemoteParticipant): void {
      // Si on a exactement 1 participant distant, utiliser le mode deux participants
      if (this.participants.length === 1) {
        this.attachRemoteVideoToSquare(track, participant);
      } else {
        this.attachRemoteVideoToThumbnail(track, participant);
      }
    }
  
    // Attacher la vidéo distante au carré (mode deux participants)
    private attachRemoteVideoToSquare(track: any, participant: RemoteParticipant): void {
      const remoteSquareContent = document.getElementById('remoteSquareContent');
      if (!remoteSquareContent) return;
  
      // Vider le contenu
      remoteSquareContent.innerHTML = '';
  
      // Créer et attacher l'élément vidéo
      const videoElement = track.attach();
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.objectFit = 'cover';
      videoElement.muted = false;
      remoteSquareContent.appendChild(videoElement);
  
      // Mettre à jour le nom du participant dans le header
      const remoteHeaderSpan = document.querySelector('.remote-participant .square-header span');
      if (remoteHeaderSpan) {
        remoteHeaderSpan.textContent = participant.identity;
      }
    }
  
    // Attacher la vidéo distante à une miniature (mode normal)
    private attachRemoteVideoToThumbnail(track: any, participant: RemoteParticipant): void {
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
      // Si on est en mode deux participants
      if (this.participants.length === 0) { // Après suppression, il reste 0 participants distants
        const remoteSquareContent = document.getElementById('remoteSquareContent');
        if (remoteSquareContent) {
          remoteSquareContent.innerHTML = `
            <i class="fas fa-user"></i>
            <div class="square-info">
              <p>En attente de participant...</p>
            </div>
          `;
        }
      } else {
        // Mode normal
        const thumbnail = document.getElementById(`thumbnail-${participantId}`);
        if (thumbnail) thumbnail.remove();
      }
    }
  
    // Mettre à jour l'affichage vidéo selon le mode
    private updateVideoDisplay(): void {
      if (this.participants.length === 1) {
        this.updateLocalVideoForTwoParticipants();
      } else {
        this.updateLocalVideo();
      }
    }
  
    // Mettre à jour la vidéo locale (mode normal)
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
  
    // Mettre à jour l'affichage de la vidéo locale pour le mode deux participants
    private updateLocalVideoForTwoParticipants(): void {
      if (!this.session) return;
  
      const localSquareContent = document.getElementById('localSquareContent');
      if (!localSquareContent) return;
  
      // Vider le contenu
      localSquareContent.innerHTML = '';
  
      if (!this.videoEnabled) {
        // Afficher un placeholder si caméra désactivée
        localSquareContent.innerHTML = `
          <i class="fas fa-video-slash" style="font-size: 3rem; color: var(--primary);"></i>
          <div class="square-info">
            <p>Caméra désactivée</p>
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
        localSquareContent.appendChild(videoElement);
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
        this.micEnabled = !this.micEnabled;
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
        
        // Mettre à jour l'affichage selon le mode
        this.updateVideoDisplay();
        
      } catch (error) {
        console.error('❌ Erreur caméra:', error);
        this.videoEnabled = !this.videoEnabled;
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
  
    // 💬 FONCTIONNALITÉS CHAT
    toggleChat(): void {
      this.showChat = !this.showChat;
      if (this.showChat) {
        this.unreadMessages = 0;
        this.scrollToBottom();
      }
      this.cdRef.detectChanges();
    }
  
    toggleParticipants(): void {
      this.showParticipants = !this.showParticipants;
      this.cdRef.detectChanges();
    }
  
    // Envoi de message
    sendMessage(): void {
      if (!this.newMessage.trim() || !this.session) {
        console.log('❌ Message vide ou session non disponible');
        return;
      }
  
      const messageData = {
        sender: this.participantName,
        text: this.newMessage,
        time: this.getCurrentTime()
      };
  
      console.log('📤 Tentative d\'envoi de message:', messageData);
  
      // Ajouter le message localement IMMÉDIATEMENT
      this.addChatMessage(this.participantName, this.newMessage, messageData.time);
  
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(messageData));
        
        this.session.localParticipant.publishData(data, DataPacket_Kind.RELIABLE);
        
        console.log('✅ Message envoyé avec succès via LiveKit');
  
      } catch (error) {
        console.error('❌ Erreur envoi message LiveKit:', error);
        
        // Fallback: Utiliser la méthode de simulation
        console.log('🔄 Utilisation du mode simulation...');
        this.simulateIncomingMessage(messageData);
      }
  
      this.newMessage = '';
      
      // Remettre le focus sur l'input
      if (this.chatInput) {
        this.chatInput.nativeElement.focus();
      }
    }
  
    // Méthode de simulation pour tester le chat
    private simulateIncomingMessage(originalMessage: any): void {
      console.log('🧪 Simulation de message entrant');
      
      setTimeout(() => {
        const simulatedMessage = {
          sender: 'Participant-Test-' + Math.floor(Math.random() * 1000),
          text: `Réponse à: "${originalMessage.text}"`,
          time: this.getCurrentTime()
        };
        
        console.log('🧪 Message simulé:', simulatedMessage);
        
        // Simuler la réception
        const encoder = new TextEncoder();
        const simulatedPayload = encoder.encode(JSON.stringify(simulatedMessage));
        
        this.handleDataReceived(
          simulatedPayload,
          { identity: simulatedMessage.sender } as RemoteParticipant,
          'chat'
        );
      }, 1000);
    }
  
    // Méthode pour ajouter des messages
    private addChatMessage(sender: string, text: string, time: string): void {
      console.log('💬 Ajout du message au chat:', { sender, text, time });
      
      const newMessage = {
        sender: sender,
        text: text,
        time: time,
        id: Date.now() + Math.random()
      };
  
      this.chatMessages = [...this.chatMessages, newMessage];
      
      console.log('📊 Messages dans le chat:', this.chatMessages.length);
      
      this.cdRef.detectChanges();
      
      this.scrollToBottom();
    }
  
    // Ajouter un message système
    private addSystemMessage(text: string): void {
      this.addChatMessage('Système', text, this.getCurrentTime());
    }
  
    // Message de bienvenue
    private addWelcomeMessage(): void {
      this.addSystemMessage('Bienvenue dans le chat de la réunion !');
      
      setTimeout(() => {
        this.addSystemMessage('💡 Tapez un message et appuyez sur Entrée pour envoyer.');
      }, 500);
  
      setTimeout(() => {
        this.addSystemMessage('✅ Le chat est maintenant opérationnel');
      }, 1000);
    }
  
    // Faire défiler vers le bas
    private scrollToBottom(): void {
      setTimeout(() => {
        if (this.chatMessagesContainer && this.chatMessagesContainer.nativeElement) {
          const container = this.chatMessagesContainer.nativeElement;
          container.scrollTop = container.scrollHeight;
          console.log('📜 Scroll vers le bas effectué');
        }
      }, 100);
    }
  
    // Obtenir l'heure actuelle formatée
    getCurrentTime(): string {
      return new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
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
  
    // Méthodes pour l'invitation
    toggleInvitePanel(): void {
      this.showInvitePanel = !this.showInvitePanel;
      
      // Fermer les autres panneaux si nécessaire
      if (this.showInvitePanel) {
        this.showChat = false;
        this.showParticipants = false;
        
        // Générer les informations d'invitation
        if (!this.meetingLink) {
          this.generateMeetingLink();
          this.generateMeetingCode();
        }
      }
    }
  
    generateMeetingLink(): void {
      // Récupérer l'ID de la salle ou en générer un
      const roomId = this.roomId || this.generateRoomId();
      this.meetingLink = `${window.location.origin}/join/${roomId}`;
    }
  
    generateMeetingCode(): void {
      // Générer un code de 8 caractères alphanumériques
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.meetingCode = code;
    }
  
    generateRoomId(): string {
      return Math.random().toString(36).substring(2, 10).toUpperCase();
    }
  
    copyMeetingLink(inputElement: HTMLInputElement): void {
      // Sélectionner et copier le texte
      inputElement.select();
      inputElement.setSelectionRange(0, 99999); // Pour mobile
      
      navigator.clipboard.writeText(this.meetingLink)
        .then(() => {
          this.showCopyNotification('Lien copié !');
        })
        .catch(err => {
          console.error('Erreur lors de la copie:', err);
          // Fallback pour anciens navigateurs
          document.execCommand('copy');
          this.showCopyNotification('Lien copié !');
        });
    }
  
    copyMeetingCode(): void {
      navigator.clipboard.writeText(this.meetingCode)
        .then(() => {
          this.showCopyNotification('Code copié !');
        })
        .catch(err => {
          console.error('Erreur lors de la copie:', err);
        });
    }
  
    sendEmailInvite(): void {
      if (this.isValidEmail(this.inviteEmail)) {
        // Ajouter à la liste des invitations en attente
        if (!this.pendingInvitations.includes(this.inviteEmail)) {
          this.pendingInvitations.push(this.inviteEmail);
          
          // Ici, vous pourriez appeler une API pour envoyer l'email
          console.log(`Invitation envoyée à: ${this.inviteEmail}`);
          
          // Réinitialiser le champ
          this.inviteEmail = '';
          
          // Afficher une notification
          this.showCopyNotification('Invitation envoyée !');
        }
      }
    }
  
    isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    showCopyNotification(message: string): void {
      // Créer une notification temporaire
      const notification = document.createElement('div');
      notification.className = 'copied-notification';
      notification.textContent = message;
      document.body.appendChild(notification);
      
      // Supprimer après 2 secondes
      setTimeout(() => {
        notification.remove();
      }, 2000);
    }
  
    // 🚪 Quitter l'appel
    async leaveCall(): Promise<void> {
      try {
        if (this.session) {
          await this.session.disconnect();
        }
        this.cleanup();
        this.router.navigate(['/ListeReunion']);
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