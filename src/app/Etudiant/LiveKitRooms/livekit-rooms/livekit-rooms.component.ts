import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoomsServiceService, Room, CreateRoomRequest, JoinRoomRequest } from 'src/app/Service/Rooms/rooms-service.service';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';

@Component({
  selector: 'app-livekit-rooms',
  templateUrl: './livekit-rooms.component.html',
  styleUrls: ['./livekit-rooms.component.scss']
})
export class LivekitRoomsComponent implements OnInit, OnDestroy {
  // États du composant
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  loading = true;
  error = '';

  // Filtres et recherche
  currentFilter = 'all';
  searchTerm = '';

  // Modal de création
  showCreateModal = false;
  newRoom: CreateRoomRequest & { topic?: string } = {
    room_name: '',
    description: '',
    maxParticipants: 10,
    isPrivate: false,
    topic: ''
  };

  // Statistiques
  totalRooms = 0;
  activeParticipants = 0;
  totalCapacity = 0;

  // Favoris
  favoriteRooms: number[] = [];

  // Gestion des subscriptions
  private destroy$ = new Subject<void>();

  constructor(
    private roomService: RoomsServiceService,
    private authService: AuthentificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Charger les favoris depuis le localStorage
    this.loadFavorites();
    
    // Vérifier l'authentification avant de charger les salles
    if (!this.authService.isLoggedIn()) {
      this.error = 'Veuillez vous connecter pour accéder aux salles LiveKit';
      this.loading = false;
      return;
    }

    this.loadRooms();
    
    // S'abonner aux mises à jour des salles
    this.roomService.rooms$
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        console.log('📦 Response from rooms$:', response);
        
        if (Array.isArray(response)) {
          this.rooms = response;
        } else if (response && typeof response === 'object' && 'rooms' in response) {
          this.rooms = (response as any).rooms || [];
        } else {
          console.warn('Format de réponse inattendu:', response);
          this.rooms = [];
        }
        
        this.applyFilters();
        this.updateStats();
        this.loading = false;
      });
  }

  /**
   * Charge les salles depuis l'API
   */
  loadRooms(): void {
    this.loading = true;
    this.error = '';

    this.roomService.getRooms().subscribe({
      next: (response) => {
        console.log('✅ Salles chargées:', response);
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 401) {
          this.error = 'Session expirée. Veuillez vous reconnecter.';
          this.authService.clearToken();
        } else {
          this.error = 'Erreur lors du chargement des salles';
          console.error('❌ Erreur chargement salles:', error);
        }
      }
    });
  }

  /**
   * Met à jour les statistiques globales
   */
  private updateStats(): void {
    if (!Array.isArray(this.rooms)) {
      this.rooms = [];
    }
    
    this.totalRooms = this.rooms.length;
    this.activeParticipants = this.rooms.reduce((total, room) => {
      return total + (room.participants || 0);
    }, 0);
    this.totalCapacity = this.rooms.reduce((total, room) => {
      return total + (room.maxParticipants || 0);
    }, 0);
  }

  /**
   * Calcule le taux d'occupation global
   */
  getOccupancyRate(): number {
    if (this.totalCapacity === 0) return 0;
    return Math.round((this.activeParticipants / this.totalCapacity) * 100);
  }

  /**
   * Compte les salles en direct
   */
  getLiveRoomsCount(): number {
    return this.rooms.filter(room => room.status === 'live').length;
  }

  /**
   * Compte les salles disponibles
   */
  getIdleRoomsCount(): number {
    return this.rooms.filter(room => room.status === 'idle').length;
  }

  /**
   * Compte les salles complètes
   */
  getFullRoomsCount(): number {
    return this.rooms.filter(room => room.status === 'full').length;
  }

  /**
   * Calcule le taux d'occupation d'une salle spécifique
   */
  getRoomOccupancyRate(room: Room): number {
    const maxParticipants = room.maxParticipants || 10;
    const participants = room.participants || 0;
    if (maxParticipants === 0) return 0;
    return Math.round((participants / maxParticipants) * 100);
  }

  /**
   * Applique les filtres et la recherche
   */
  applyFilters(): void {
    if (!Array.isArray(this.rooms)) {
      this.filteredRooms = [];
      return;
    }

    let filtered = [...this.rooms];

    // Filtre par statut
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(room => room.status === this.currentFilter);
    }

    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(room => 
        room.room_name.toLowerCase().includes(searchLower) ||
        (room.description && room.description.toLowerCase().includes(searchLower)) ||
        (room.host && room.host.toLowerCase().includes(searchLower)) ||
        (room.topic && room.topic.toLowerCase().includes(searchLower))
      );
    }

    this.filteredRooms = filtered;
  }

  /**
   * Retourne les participants d'une salle
   */
  getRoomParticipants(room: Room): string[] {
    return room.participantsList || [];
  }

  /**
   * Génère les initiales d'un participant
   */
  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(part => part.charAt(0).toUpperCase()).join('').substring(0, 2);
  }

  /**
   * Gestion des favoris
   */
  toggleFavorite(room: Room): void {
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

  isFavorite(room: Room): boolean {
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

  /**
   * Copie le lien de la salle
   */
  copyRoomLink(room: Room): void {
    const roomUrl = `${window.location.origin}/pre-room?room=${room.id || room.room_name}&roomName=${encodeURIComponent(room.room_name || '')}`;
    navigator.clipboard.writeText(roomUrl).then(() => {
      console.log('Lien copié:', roomUrl);
    });
  }

  /**
   * Partage la salle
   */
  shareRoom(room: Room): void {
    if (navigator.share) {
      navigator.share({
        title: `Rejoignez ${room.room_name}`,
        text: room.description || `Rejoignez la salle ${room.room_name}`,
        url: `${window.location.origin}/pre-room?room=${room.id || room.room_name}&roomName=${encodeURIComponent(room.room_name || '')}`
      });
    } else {
      this.copyRoomLink(room);
    }
  }

  /**
   * Change le filtre actif
   */
  onFilterChange(filter: string): void {
    this.currentFilter = filter;
    this.applyFilters();
  }

  /**
   * Gère la recherche
   */
  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  /**
   * Rejoint une salle - Redirige vers la page de préparation
   */
  joinRoom(room: any): void {
    console.log('🔍 DEBUG - Objet room reçu:', room);
    
    // Vérifier la connexion
    if (!this.authService.isLoggedIn()) {
      alert('Veuillez vous connecter pour rejoindre une salle');
      this.router.navigate(['/login']);
      return;
    }

    // Vérifier que la salle n'est pas pleine
    const currentParticipants = room.participants || room.num_participants || 0;
    const maxParticipants = room.maxParticipants || room.max_participants || 10;
    
    if (currentParticipants >= maxParticipants) {
      alert('Cette salle est déjà pleine');
      return;
    }

    // Utiliser les propriétés de la salle
    const roomIdentifier = room.id || room.sid || room.room_name;
    const roomName = room.room_name || room.name || 'Salle sans nom';
    
    if (!roomIdentifier) {
      console.error('❌ Données room incomplètes:', room);
      alert('Cette salle a des données incomplètes. Veuillez réessayer.');
      return;
    }

    console.log('🎯 Identifiant de salle trouvé:', roomIdentifier);
    console.log('🎯 Nom de salle:', roomName);

    // Préparer les paramètres pour la page de préparation
    const queryParams: any = {
      room: roomIdentifier,
      roomName: roomName,
      participant: this.getUserName(),
      maxParticipants: maxParticipants
    };

    // Ajouter les données supplémentaires si disponibles
    if (room.description) {
      queryParams.roomDescription = room.description;
    }
    if (room.topic) {
      queryParams.topic = room.topic;
    }
    if (currentParticipants > 0) {
      queryParams.currentParticipants = currentParticipants;
    }

    console.log('📤 Redirection vers pre-room avec:', queryParams);

    // Rediriger vers la page de préparation
    this.router.navigate(['/pre-room'], { queryParams });
  }

  /**
   * Affiche les détails d'une salle
   */
  showRoomDetails(room: Room): void {
    const creationTime = room.createdAt ? new Date(room.createdAt).toLocaleString('fr-FR') : 'Inconnue';
    const occupancyRate = this.getRoomOccupancyRate(room);
    
    const details = `
🏠 **Salle:** ${room.room_name || 'Sans nom'}
📝 **Description:** ${room.description || 'Aucune description'}
${room.topic ? `📚 **Sujet:** ${room.topic}` : ''}
👤 **Hôte:** ${room.host || 'Système'}
👥 **Participants:** ${room.participants || 0}/${room.maxParticipants || 10} (${occupancyRate}%)
🏷️ **Statut:** ${this.getStatusText(room.status)}
${room.isPrivate ? '🔒 **Salle privée**' : '🔓 **Salle publique**'}
🕐 **Créée le:** ${creationTime}
⏱️ **Durée:** ${room.duration || 'Nouvelle session'}
${room.participantsList && room.participantsList.length > 0 ? 
  `👥 **Participants actuels:**\n${room.participantsList.map(p => `   • ${p}`).join('\n')}` : 
  '👥 **Aucun participant actuellement**'}
    `;
    
    alert(details);
  }

  /**
   * Ouvre le modal de création de salle
   */
  openCreateModal(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Veuillez vous connecter pour créer une salle');
      this.router.navigate(['/login']);
      return;
    }

    this.showCreateModal = true;
    this.newRoom = {
      room_name: '',
      description: '',
      topic: '',
      maxParticipants: 10,
      isPrivate: false
    };
  }

  /**
   * Ferme le modal de création
   */
  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  /**
   * Crée une nouvelle salle et redirige vers la préparation
   */
  createRoom(): void {
    if (!this.newRoom.room_name.trim()) {
      alert('Veuillez donner un nom à votre salle');
      return;
    }

    this.loading = true;
    
    this.roomService.createRoom(this.newRoom)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdRoom: Room) => {
          console.log('✅ Salle créée avec succès:', createdRoom);
          this.closeCreateModal();
          this.loading = false;
          
          // Préparer les paramètres pour la redirection
          const queryParams: any = {
            room: createdRoom.id || createdRoom.room_name,
            roomName: createdRoom.room_name,
            participant: this.getUserName(),
            maxParticipants: createdRoom.maxParticipants || 10
          };

          if (createdRoom.description) {
            queryParams.roomDescription = createdRoom.description;
          }
          if (this.newRoom.topic) {
            queryParams.topic = this.newRoom.topic;
          }

          console.log('📤 Création - Redirection vers pre-room:', queryParams);
          
          // Rediriger vers la page de préparation
          this.router.navigate(['/Preparation'], { queryParams });
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 401) {
            this.error = 'Session expirée. Veuillez vous reconnecter.';
            this.authService.clearToken();
          } else {
            this.error = 'Erreur lors de la création de la salle';
            console.error('❌ Erreur création salle:', error);
            alert('Erreur lors de la création de la salle. Veuillez réessayer.');
          }
        }
      });
  }

  /**
   * Rafraîchit la liste des salles
   */
  refreshRooms(): void {
    this.loadRooms();
  }

  /**
   * Retourne le texte du statut
   */
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'live': 'En direct 🟢',
      'idle': 'Disponible 🟡', 
      'full': 'Complète 🔴'
    };
    return statusMap[status] || 'Statut inconnu';
  }

  /**
   * Retourne l'icône du statut
   */
  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'live': 'fas fa-broadcast-tower',
      'idle': 'fas fa-door-open',
      'full': 'fas fa-lock'
    };
    return iconMap[status] || 'fas fa-question-circle';
  }

  /**
   * Formate la durée depuis la création
   */
  getTimeSinceCreation(room: Room): string {
    if (!room.createdAt) return 'Date inconnue';
    
    try {
      const created = new Date(room.createdAt);
      const now = new Date();
      const diffMs = now.getTime() - created.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      } else if (diffHours > 0) {
        return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
      } else if (diffMins > 0) {
        return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
      } else {
        return 'À l\'instant';
      }
    } catch (error) {
      return 'Date invalide';
    }
  }

  /**
   * Récupère le nom de l'utilisateur actuel
   */
  private getUserName(): string {
    const user = this.authService.getUser();
    return user?.nom || user?.avatar_url || user?.email?.split('@')[0] || 'Utilisateur';
  }

  /**
   * Retourne la classe CSS pour la barre d'occupation
   */
  getOccupancyClass(rate: number): string {
    if (rate < 50) return 'low';
    if (rate < 80) return 'medium';
    return 'high';
  }

  /**
   * Nettoyage des subscriptions
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Génère une couleur aléatoire pour les avatars
   */
  getRandomColor(): string {
    const colors = [
      '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
      '#8B5CF6', '#F97316', '#84CC16', '#14B8A6'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}