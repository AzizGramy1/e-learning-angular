import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { from, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { CreateRoomRequest, Room, RoomsServiceService } from 'src/app/Service/Rooms/rooms-service.service';

interface ExtendedRoom {
  id: number;
  room_name: string;
  description: string;
  maxParticipants: number;
  isPrivate: boolean;
  status?: 'idle' | 'live';
  participants?: number;
  host?: string;
  duration?: string;
  createdAt?: string;
  topic?: string;
  participantsList?: string[];
  isJoined?: boolean;
  isOrganizer?: boolean;
}

@Component({
  selector: 'app-reunion-index',
  templateUrl: './reunion-index.component.html',
  styleUrls: ['./reunion-index.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('pulse', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class ReunionIndexComponent implements OnInit, OnDestroy {

  // Modal de création de salle
  showCreateModal = false;
  isCreatingRoom = false;
  createRoomError = '';
  createRoomSuccess = '';

  // Données du formulaire
  newRoom: CreateRoomRequest & { topic?: string } = {
    room_name: '',
    description: '',
    maxParticipants: 20,
    isPrivate: false,
    topic: ''
  };

  // Types de salles pour le formulaire
  roomTypesForCreation = [
    { value: 'meeting', label: 'Réunion', icon: '👥' },
    { value: 'course', label: 'Cours', icon: '📚' },
    { value: 'workshop', label: 'Atelier', icon: '🔧' },
    { value: 'qa', label: 'Q&A', icon: '❓' },
    { value: 'tutorial', label: 'Tutoriel', icon: '🎓' },
    { value: 'seminar', label: 'Séminaire', icon: '🎤' },
    { value: 'social', label: 'Social', icon: '🎉' },
    { value: 'review', label: 'Révision', icon: '🔄' }
  ];

  // Options de durée d'expiration (en secondes)
  timeoutOptions = [
    { value: 1800, label: '30 minutes' },
    { value: 3600, label: '1 heure' },
    { value: 7200, label: '2 heures' },
    { value: 10800, label: '3 heures' },
    { value: 21600, label: '6 heures' },
    { value: 43200, label: '12 heures' },
    { value: 86400, label: '24 heures' }
  ];

  // Données
  currentUser: any;

  // Données
  rooms: ExtendedRoom[] = [];
  filteredRooms: ExtendedRoom[] = [];

  // Rooms cards in view
  visibleRooms: ExtendedRoom[] = [];

  // Modal de vérification des périphériques
  selectedRoomForJoin: ExtendedRoom | null = null;
  
  // États
  isLoading = true;
  isRefreshing = false;
  errorMessage = '';
  successMessage = '';
  
  // Filtres
  searchTerm = '';
  activeFilter: 'all' | 'idle' | 'live' = 'all';
  selectedDate: string = '';
  
  // Types de salles disponibles
  meetingTypes = [
    { value: 'all', label: 'Tous types', icon: '🌐' },
    { value: 'course', label: 'Cours', icon: '📚' },
    { value: 'meeting', label: 'Réunion', icon: '👥' },
    { value: 'workshop', label: 'Atelier', icon: '🔧' },
    { value: 'qa', label: 'Q&A', icon: '❓' },
    { value: 'seminar', label: 'Séminaire', icon: '🎤' },
    { value: 'tutorial', label: 'Tutoriel', icon: '🎓' },
    { value: 'social', label: 'Social', icon: '🎉' }
  ];
  
  selectedType: string = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;
  
  // Statistiques
  stats = {
    total: 0,
    upcoming: 0,
    ongoing: 0,
    joined: 0,
    participants: 0,
    available: 0
  };
  
  // Rooms cards in view
  expandedRoomId: number | null = null;
  joiningRoomId: number | null = null;

  // Favoris
  favoriteRooms: number[] = [];

  // Modal de vérification des périphériques
  showDeviceCheckModal = false;

  // Propriétés pour la vérification des périphériques
  isCameraActive = false;
  isMicrophoneActive = false;
  isSpeaking = false;
  audioLevel = 0;

  // Périphériques disponibles
  availableCameras: any[] = [];
  availableMicrophones: any[] = [];

  // Périphériques sélectionnés
  selectedCamera = '';
  selectedMicrophone = '';

  // Références aux flux média
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphoneSource: MediaStreamAudioSourceNode | null = null;

  // Références aux éléments DOM
  @ViewChild('cameraPreview') cameraPreview!: ElementRef<HTMLVideoElement>;

  // Gestion des subscriptions
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private roomService: RoomsServiceService,
    private authService: AuthentificationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadFavorites();
    this.loadRooms();
    
    // S'abonner aux mises à jour des salles
    this.roomService.rooms$
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        console.log('📦 Response from rooms$:', response);
        
        let roomsArray: ExtendedRoom[] = [];
        
        if (Array.isArray(response)) {
          roomsArray = response.map((room: any) => ({
            ...room,
            isJoined: false,
            isOrganizer: room.host === this.currentUser?.name,
            status: room.status || 'idle',
            participants: room.participants || 0,
            host: room.host || 'Organisateur inconnu',
            duration: room.duration || 'Non spécifiée',
            createdAt: room.createdAt || new Date().toISOString(),
            topic: room.topic || 'meeting',
            participantsList: room.participantsList || []
          }));
        } else if (response && typeof response === 'object' && 'rooms' in response) {
          roomsArray = (response.rooms || []).map((room: any) => ({
            ...room,
            isJoined: false,
            isOrganizer: room.host === this.currentUser?.name,
            status: room.status || 'idle',
            participants: room.participants || 0,
            host: room.host || 'Organisateur inconnu',
            duration: room.duration || 'Non spécifiée',
            createdAt: room.createdAt || new Date().toISOString(),
            topic: room.topic || 'meeting',
            participantsList: room.participantsList || []
          }));
        } else {
          console.warn('Format de réponse inattendu:', response);
          roomsArray = [];
        }
        
        this.rooms = roomsArray;
        
        // Marquer les salles rejointes
        this.markJoinedRooms();
        this.applyFilters();
        this.updateStatistics();
        this.isLoading = false;
        this.isRefreshing = false;
      });
  }

  ngOnDestroy(): void {
    this.cleanupMediaStreams();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** 🔹 Charger les salles */
  loadRooms(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Veuillez vous connecter pour accéder aux salles';
      this.isLoading = false;
      return;
    }

    this.roomService.getRooms().subscribe({
      next: (response: any) => {
        console.log('✅ Salles chargées:', response);
        
        let roomsArray: ExtendedRoom[] = [];
        
        if (Array.isArray(response)) {
          roomsArray = response.map((room: any) => ({
            ...room,
            isJoined: false,
            isOrganizer: room.host === this.currentUser?.name,
            status: room.status || 'idle',
            participants: room.participants || 0,
            host: room.host || 'Organisateur inconnu',
            duration: room.duration || 'Non spécifiée',
            createdAt: room.createdAt || new Date().toISOString(),
            topic: room.topic || 'meeting',
            participantsList: room.participantsList || []
          }));
        } else if (response && typeof response === 'object' && 'rooms' in response) {
          roomsArray = (response.rooms || []).map((room: any) => ({
            ...room,
            isJoined: false,
            isOrganizer: room.host === this.currentUser?.name,
            status: room.status || 'idle',
            participants: room.participants || 0,
            host: room.host || 'Organisateur inconnu',
            duration: room.duration || 'Non spécifiée',
            createdAt: room.createdAt || new Date().toISOString(),
            topic: room.topic || 'meeting',
            participantsList: room.participantsList || []
          }));
        }
        
        this.rooms = roomsArray;
        
        // Marquer les salles rejointes
        this.markJoinedRooms();
        this.applyFilters();
        this.updateStatistics();
        this.isLoading = false;
        this.isRefreshing = false;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          this.authService.clearToken();
        } else {
          this.errorMessage = 'Erreur lors du chargement des salles';
          console.error('❌ Erreur chargement salles:', error);
        }
      }
    });
  }

  /** 🔹 Mettre à jour les statistiques */
  updateStatistics(): void {
    this.stats = {
      total: this.rooms.length,
      upcoming: this.rooms.filter(room => room.status === 'idle' && (room.participants || 0) === 0).length,
      ongoing: this.rooms.filter(room => room.status === 'live').length,
      joined: this.rooms.filter(room => room.isJoined).length,
      participants: this.rooms.reduce((sum, room) => sum + (room.participants || 0), 0),
      available: this.rooms.filter(room => 
        !room.isPrivate && (room.participants || 0) < room.maxParticipants
      ).length
    };
  }

  /** 🔹 Marquer les salles rejointes */
  private markJoinedRooms(): void {
    const joinedRooms = JSON.parse(localStorage.getItem('joined-livekit-rooms') || '[]');
    this.rooms = this.rooms.map(room => ({
      ...room,
      isJoined: joinedRooms.includes(room.room_name)
    }));
  }

  

  /** 🔹 Rafraîchir les salles */
  refreshRooms(): void {
    this.isRefreshing = true;
    this.successMessage = '';
    
    this.roomService.getRooms().subscribe({
      next: () => {
        this.successMessage = 'Liste des salles rafraîchie avec succès !';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Erreur lors du rafraîchissement:', error);
        this.isRefreshing = false;
      }
    });
  }

  /** 🔹 Appliquer les filtres */
  applyFilters(): void {
    let filtered = [...this.rooms];
    
    // Filtre par statut
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(room => room.status === this.activeFilter);
    }
    
    // Filtre par type (basé sur le topic)
    if (this.selectedType !== 'all') {
      filtered = filtered.filter(room => 
        room.topic?.toLowerCase() === this.selectedType
      );
    }
    
    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(room => 
        room.room_name.toLowerCase().includes(term) ||
        room.description.toLowerCase().includes(term) ||
        room.host?.toLowerCase().includes(term) ||
        room.topic?.toLowerCase().includes(term)
      );
    }
    
    // Mettre à jour la pagination
    this.filteredRooms = filtered;
    this.totalPages = Math.ceil(this.filteredRooms.length / this.itemsPerPage);
    this.updateVisibleRooms();
  }

  /** 🔹 Mettre à jour les salles visibles (pagination) */
  updateVisibleRooms(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.visibleRooms = this.filteredRooms.slice(startIndex, endIndex);
  }

  /** 🔹 Vérifier si l'utilisateur a déjà rejoint une salle */
  checkIfJoined(roomName: string): boolean {
    const joinedRooms = JSON.parse(localStorage.getItem('joined-livekit-rooms') || '[]');
    return joinedRooms.includes(roomName);
  }

  /** 🔹 Sauvegarder la salle rejointe */
  saveJoinedMeeting(roomName: string): void {
    const joinedRooms = JSON.parse(localStorage.getItem('joined-livekit-rooms') || '[]');
    if (!joinedRooms.includes(roomName)) {
      joinedRooms.push(roomName);
      localStorage.setItem('joined-livekit-rooms', JSON.stringify(joinedRooms));
    }
    
    // Mettre à jour le statut local
    this.rooms = this.rooms.map(room => {
      if (room.room_name === roomName) {
        return { 
          ...room, 
          isJoined: true,
          participants: (room.participants || 0) + 1 
        };
      }
      return room;
    });
    
    this.applyFilters();
    this.updateStatistics();
  }

  /** 🔹 Rejoindre une salle - Ouvre le modal de vérification */
  joinMeeting(room: ExtendedRoom): void {
    if (this.joiningRoomId === room.id) return;
    
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Vous devez être connecté pour rejoindre une salle.';
      setTimeout(() => this.errorMessage = '', 5000);
      this.router.navigate(['/login']);
      return;
    }
    
    // Vérifier si la salle est pleine
    if (!room.isPrivate && (room.participants || 0) >= room.maxParticipants) {
      this.errorMessage = 'Cette salle est pleine. Impossible de rejoindre.';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }
    
    this.selectedRoomForJoin = room;
    this.showDeviceCheckModal = true;
    
    // Initialiser la vérification des périphériques
    setTimeout(() => {
      this.initializeDeviceCheck();
    }, 100);
  }

  /** 🔹 Quitter une salle */
  leaveMeeting(room: ExtendedRoom): void {
    if (!confirm('Voulez-vous vraiment quitter cette salle ?')) {
      return;
    }
    
    // Retirer de la liste des salles rejointes
    const joinedRooms = JSON.parse(localStorage.getItem('joined-livekit-rooms') || '[]');
    const index = joinedRooms.indexOf(room.room_name);
    if (index > -1) {
      joinedRooms.splice(index, 1);
      localStorage.setItem('joined-livekit-rooms', JSON.stringify(joinedRooms));
    }
    
    // Mettre à jour le statut local
    room.isJoined = false;
    if (room.participants && room.participants > 0) {
      room.participants -= 1;
    }
    
    this.applyFilters();
    this.updateStatistics();
    
    this.successMessage = `Vous avez quitté la salle "${room.room_name}".`;
    setTimeout(() => this.successMessage = '', 3000);
  }

  /** 🔹 Initialiser la vérification des périphériques */
  async initializeDeviceCheck(): Promise<void> {
    try {
      // Obtenir la liste des périphériques
      await this.getAvailableDevices();
      
      // Démarrer la caméra et le micro
      await this.startCamera();
      await this.startMicrophone();
      
      // Démarrer la surveillance audio
      this.startAudioMonitoring();
      
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des périphériques:', error);
      this.errorMessage = 'Impossible d\'accéder aux périphériques. Vérifiez vos permissions.';
    }
  }

  /** 🔹 Obtenir la liste des périphériques disponibles */
  async getAvailableDevices(): Promise<void> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      this.availableCameras = devices
        .filter(device => device.kind === 'videoinput')
        .map((device, index) => ({
          ...device,
          index
        }));
      
      this.availableMicrophones = devices
        .filter(device => device.kind === 'audioinput')
        .map((device, index) => ({
          ...device,
          index
        }));
      
      // Sélectionner le premier périphérique par défaut
      if (this.availableCameras.length > 0) {
        this.selectedCamera = this.availableCameras[0].deviceId;
      }
      
      if (this.availableMicrophones.length > 0) {
        this.selectedMicrophone = this.availableMicrophones[0].deviceId;
      }
      
    } catch (error) {
      console.error('Erreur lors de la récupération des périphériques:', error);
    }
  }

  /** 🔹 Démarrer la caméra */
  async startCamera(): Promise<void> {
    try {
      if (this.mediaStream) {
        // Arrêter le flux précédent
        this.mediaStream.getTracks().forEach(track => track.stop());
      }
      
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: this.selectedCamera ? { exact: this.selectedCamera } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (this.cameraPreview && this.cameraPreview.nativeElement) {
        this.cameraPreview.nativeElement.srcObject = this.mediaStream;
        this.isCameraActive = true;
      }
      
    } catch (error) {
      console.error('Erreur lors du démarrage de la caméra:', error);
      this.isCameraActive = false;
    }
  }

  /** 🔹 Démarrer le microphone */
  async startMicrophone(): Promise<void> {
    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: this.selectedMicrophone ? { exact: this.selectedMicrophone } : undefined
        },
        video: false
      };
      
      const audioStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Créer l'audio context pour l'analyse
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.microphoneSource = this.audioContext.createMediaStreamSource(audioStream);
      this.analyser = this.audioContext.createAnalyser();
      
      this.microphoneSource.connect(this.analyser);
      this.analyser.fftSize = 256;
      
      this.isMicrophoneActive = true;
      
    } catch (error) {
      console.error('Erreur lors du démarrage du microphone:', error);
      this.isMicrophoneActive = false;
    }
  }

  /** 🔹 Démarrer la surveillance audio */
  startAudioMonitoring(): void {
    if (!this.analyser) return;
    
    const updateAudioLevel = () => {
      if (!this.analyser || !this.isMicrophoneActive) {
        this.audioLevel = 0;
        this.isSpeaking = false;
        return;
      }
      
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(dataArray);
      
      // Calculer le niveau audio moyen
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      this.audioLevel = Math.min(100, (average / 255) * 100);
      
      // Détecter si l'utilisateur parle
      this.isSpeaking = this.audioLevel > 10;
      
      // Continuer la surveillance
      requestAnimationFrame(updateAudioLevel);
    };
    
    updateAudioLevel();
  }

  /** 🔹 Changer de caméra */
  async changeCamera(): Promise<void> {
    if (this.isCameraActive) {
      await this.startCamera();
    }
  }

  /** 🔹 Changer de microphone */
  async changeMicrophone(): Promise<void> {
    if (this.isMicrophoneActive) {
      await this.startMicrophone();
      this.startAudioMonitoring();
    }
  }

  /** 🔹 Basculer la caméra */
  toggleCamera(): void {
    this.isCameraActive = !this.isCameraActive;
    
    if (this.isCameraActive) {
      this.startCamera();
    } else if (this.mediaStream) {
      this.mediaStream.getVideoTracks().forEach(track => track.stop());
      if (this.cameraPreview && this.cameraPreview.nativeElement) {
        this.cameraPreview.nativeElement.srcObject = null;
      }
    }
  }

  /** 🔹 Basculer le microphone */
  toggleMicrophone(): void {
    this.isMicrophoneActive = !this.isMicrophoneActive;
    
    if (!this.isMicrophoneActive && this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.analyser = null;
      this.microphoneSource = null;
      this.audioLevel = 0;
      this.isSpeaking = false;
    } else if (this.isMicrophoneActive) {
      this.startMicrophone();
      this.startAudioMonitoring();
    }
  }

  /** 🔹 Obtenir le statut du microphone */
  getMicrophoneStatus(): string {
    if (!this.isMicrophoneActive) return 'Microphone désactivé';
    if (this.isSpeaking) return 'Vous parlez...';
    return 'Microphone actif';
  }

  /** 🔹 Gérer la complétion de la vérification des périphériques */
  onDeviceCheckComplete(): void {
    // Arrêter tous les flux média
    this.cleanupMediaStreams();
    
    // Sauvegarder la salle comme rejointe
    if (this.selectedRoomForJoin) {
      this.saveJoinedMeeting(this.selectedRoomForJoin.room_name);
      
      // Naviguer vers la page VideoCall avec les paramètres de la salle
      this.router.navigate(['/VideoCallFormateur'], {
        queryParams: {
          room: this.selectedRoomForJoin.room_name,
          roomName: encodeURIComponent(this.selectedRoomForJoin.room_name),
          roomId: this.selectedRoomForJoin.id
        }
      });
    }
    
    // Fermer le modal
    this.showDeviceCheckModal = false;
    this.selectedRoomForJoin = null;
  }

  /** 🔹 Annuler la vérification des périphériques */
  onDeviceCheckCancel(): void {
    // Arrêter tous les flux média
    this.cleanupMediaStreams();
    
    // Fermer le modal
    this.showDeviceCheckModal = false;
    this.selectedRoomForJoin = null;
  }

  /** 🔹 Copier le lien de la salle */
  copyMeetingLink(room: ExtendedRoom): void {
    const shareUrl = this.getShareableUrl(room.room_name);
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        // Feedback visuel temporaire
        const buttons = document.querySelectorAll('.copy-btn');
        buttons.forEach(btn => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '✅ Copié !';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        });
      })
      .catch(err => {
        console.error('Erreur lors de la copie : ', err);
      });
  }

  /** 🔹 Formater l'URL de la réunion pour partage */
  getShareableUrl(roomName: string): string {
    return `${window.location.origin}/pre-room?room=${roomName}&roomName=${encodeURIComponent(roomName)}`;
  }

  /** 🔹 Basculer l'affichage des détails */
  toggleMeetingDetails(roomId: number): void {
    this.expandedRoomId = this.expandedRoomId === roomId ? null : roomId;
  }

  /** 🔹 Obtenir l'icône du type de salle */
  getMeetingIcon(topic: string | undefined): string {
    const icons: {[key: string]: string} = {
      'course': '📚',
      'meeting': '👥',
      'workshop': '🔧',
      'qa': '❓',
      'seminar': '🎤',
      'tutorial': '🎓',
      'social': '🎉',
      'review': '🔄'
    };
    return icons[topic || ''] || '🖥️';
  }

  /** 🔹 Obtenir la classe CSS du badge de statut */
  getStatusBadgeClass(room: ExtendedRoom): string {
    if (room.isPrivate) return 'bg-purple-900 text-purple-300 border-purple-700';
    if (room.status === 'idle' && room.participants === 0) return 'bg-gray-700 text-gray-300 border-gray-600';
    if ((room.participants || 0) >= room.maxParticipants) return 'bg-red-900 text-red-300 border-red-700';
    return 'bg-green-900 text-green-300 border-green-700';
  }

  /** 🔹 Obtenir le texte du statut */
  getStatusText(room: ExtendedRoom): string {
    if (room.isPrivate) return '🔒 Privée';
    if (room.status === 'idle' && room.participants === 0) return '⏰ À venir';
    if ((room.participants || 0) >= room.maxParticipants) return '🚫 Pleine';
    return '🎥 En cours';
  }

  /** 🔹 Formater la date */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /** 🔹 Formater la durée */
  formatDuration(duration: string): string {
    return duration || 'Non spécifiée';
  }

  /** 🔹 Obtenir le temps restant */
  getTimeRemaining(room: ExtendedRoom): string {
    const creationTime = new Date(room.createdAt || '');
    const now = new Date();
    const diffMs = now.getTime() - creationTime.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 5) return 'Commence bientôt';
    return 'Démarre dans 5 min';
  }

  /** 🔹 Calculer le pourcentage de participation */
  getProgressPercentage(room: ExtendedRoom): number {
    return Math.min(100, ((room.participants || 0) / room.maxParticipants) * 100);
  }

  /** 🔹 Obtenir la couleur de la barre de progression */
  getProgressColor(room: ExtendedRoom): string {
    const percentage = this.getProgressPercentage(room);
    
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  /** 🔹 Changer de page */
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateVisibleRooms();
  }

  /** 🔹 Réinitialiser les filtres */
  resetFilters(): void {
    this.searchTerm = '';
    this.activeFilter = 'all';
    this.selectedType = 'all';
    this.selectedDate = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  /** 🔹 Ouvrir le modal de création */
  openCreateModal(): void {
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Veuillez vous connecter pour créer une salle';
      setTimeout(() => this.errorMessage = '', 5000);
      this.router.navigate(['/login']);
      return;
    }

    this.showCreateModal = true;
    this.createRoomError = '';
    this.createRoomSuccess = '';
    
    this.newRoom = {
      room_name: '',
      description: '',
      maxParticipants: 20,
      isPrivate: false,
      topic: ''
    };
  }

  /** 🔹 Fermer le modal de création */
  closeCreateModal(): void {
    this.showCreateModal = false;
    this.isCreatingRoom = false;
  }

  /** 🔹 Créer une salle LiveKit */
  createLiveKitRoom(): void {
    if (this.isCreatingRoom) return;
    
    // Validation du formulaire
    if (!this.validateRoomForm()) {
      return;
    }
    
    this.isCreatingRoom = true;
    this.createRoomError = '';
    this.createRoomSuccess = '';
    
    console.log('Données envoyées à l\'API:', this.newRoom);
    
    // Appeler le service pour créer la salle
    this.roomService.createRoom(this.newRoom).subscribe({
      next: (response) => {
        console.log('Salle créée avec succès:', response);
        this.createRoomSuccess = 'Salle créée avec succès!';
        this.isCreatingRoom = false;
        
        // Rafraîchir la liste des salles après 2 secondes
        setTimeout(() => {
          this.refreshRooms();
          this.closeCreateModal();
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        this.createRoomError = error.error?.message || 'Erreur lors de la création de la salle.';
        this.isCreatingRoom = false;
      }
    });
  }

  /** 🔹 Valider le formulaire */
  validateRoomForm(): boolean {
    if (!this.newRoom.room_name.trim()) {
      this.createRoomError = 'Le nom de la salle est requis.';
      return false;
    }
    
    if (!this.newRoom.description.trim()) {
      this.createRoomError = 'La description est requise.';
      return false;
    }
    
    if (this.newRoom.maxParticipants < 1 || this.newRoom.maxParticipants > 100) {
      this.createRoomError = 'Le nombre de participants doit être entre 1 et 100.';
      return false;
    }
    
    return true;
  }

  /** 🔹 Générer un nom de salle valide */
  generateRoomName(baseName: string): string {
    let name = baseName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const timestamp = Date.now().toString().slice(-6);
    name = name ? `${name}-${timestamp}` : `room-${timestamp}`;
    
    return name;
  }

  /** 🔹 Obtenir l'icône du type de salle */
  getRoomTypeIcon(type: string): string {
    const typeObj = this.roomTypesForCreation.find(t => t.value === type);
    return typeObj ? typeObj.icon : '🖥️';
  }

  /** 🔹 Supprimer une salle */
  deleteMeeting(room: ExtendedRoom): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la salle "${room.room_name}" ? Cette action est irréversible.`)) {
      return;
    }
    
    this.roomService.deleteRoom(room.id).subscribe({
      next: () => {
        // Retirer de la liste locale
        this.rooms = this.rooms.filter(r => r.id !== room.id);
        this.applyFilters();
        this.updateStatistics();
        
        this.successMessage = `Salle "${room.room_name}" supprimée avec succès.`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Erreur suppression:', error);
        this.errorMessage = 'Erreur lors de la suppression.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  /** 🔹 Obtenir le label du type de meeting */
  getMeetingTypeLabel(topic: string | undefined): string {
    if (!topic) return 'Non défini';
    
    const foundType = this.meetingTypes.find(t => t.value === topic);
    return foundType ? foundType.label : 'Autre';
  }

  /** 🔹 Méthode pour tester la connexion */
  testConnection(): void {
    this.roomService.testConnection().subscribe({
      next: (response) => {
        console.log('Test de connexion réussi:', response);
        this.successMessage = 'Connexion API réussie!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        this.errorMessage = 'Impossible de se connecter à l\'API';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  /** 🔹 Gestion des favoris */
  toggleFavorite(room: ExtendedRoom): void {
    const roomId = room.id;
    if (!roomId) return;

    const index = this.favoriteRooms.indexOf(roomId);
    if (index > -1) {
      this.favoriteRooms.splice(index, 1);
    } else {
      this.favoriteRooms.push(roomId);
    }
    this.saveFavorites();
  }

  isFavorite(room: ExtendedRoom): boolean {
    return room.id ? this.favoriteRooms.includes(room.id) : false;
  }

  private loadFavorites(): void {
    const saved = localStorage.getItem('favoriteRooms');
    if (saved) {
      this.favoriteRooms = JSON.parse(saved);
    }
  }

  private saveFavorites(): void {
    localStorage.setItem('favoriteRooms', JSON.stringify(this.favoriteRooms));
  }

  /** 🔹 Générer une couleur aléatoire pour les avatars */
  getRandomColor(): string {
    const colors = [
      '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
      '#8B5CF6', '#F97316', '#84CC16', '#14B8A6'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /** 🔹 Retourne les participants d'une salle */
  getRoomParticipants(room: ExtendedRoom): string[] {
    return room.participantsList || [];
  }

  /** 🔹 Génère les initiales d'un participant */
  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(part => part.charAt(0).toUpperCase()).join('').substring(0, 2);
  }

  /** 🔹 Nettoyer les flux média */
  private cleanupMediaStreams(): void {
    // Arrêter la caméra
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    // Arrêter l'audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.analyser = null;
      this.microphoneSource = null;
    }
    
    // Réinitialiser les états
    this.isCameraActive = false;
    this.isMicrophoneActive = false;
    this.isSpeaking = false;
    this.audioLevel = 0;
  }
}