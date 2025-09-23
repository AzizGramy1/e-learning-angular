import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reunion } from 'src/app/Models/Reunion';
import { ReunionService } from 'src/app/Service/Reunion/reunion.service';

@Component({
  selector: 'app-reunion-menu-etudiant',
  templateUrl: './reunion-menu-etudiant.component.html',
  styleUrls: ['./reunion-menu-etudiant.component.scss']
})
export class ReunionMenuEtudiantComponent implements OnInit {

 reunions: Reunion[] = [];
  filteredMeetings: Reunion[] = [];
  currentMeeting: Reunion | null = null;

  // Sidebar
  isSidebarOpen: boolean = false;

  // Filtrage
  activeFilter: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'all' = 'all';

  // Calendrier
  daysOfWeek: string[] = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  calendarDays: { day: number, hasEvents: boolean, selected: boolean }[] = [];

  constructor(private reunionService: ReunionService, private router:Router) { }

  ngOnInit(): void {
    this.reunionService.getMesReunions().subscribe(reunions => {
      this.reunions = reunions.map(r => this.mapReunion(r));
      this.applyFilter();
      this.generateCalendarDays();
    });
  }

  // Toggle sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Mapping des réunions
  private mapReunion(r: any): Reunion {
    const debut = r.date_debut ? new Date(r.date_debut) : null;
    const fin = r.date_fin ? new Date(r.date_fin) : null;

    let status = 'upcoming';
    let statusLabel = 'À venir';
    let action = 'Rejoindre';

    if (r.statut === 'en_cours') {
      status = 'live';
      statusLabel = 'En direct';
      action = 'Rejoindre maintenant';
    } else if (r.statut === 'termine') {
      status = 'completed';
      statusLabel = 'Terminé';
      action = 'Voir le replay';
    }

    const heure = debut
      ? debut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    let timeLeft = '';
    if (debut) {
      const diff = debut.getTime() - Date.now();
      if (diff > 0) {
        const minutes = Math.floor(diff / 60000);
        timeLeft = `Dans ${minutes} min`;
      } else if (r.statut === 'en_cours') {
        timeLeft = 'En cours';
      } else {
        timeLeft = 'Terminé';
      }
    }

    return {
      ...r,
      date: debut,
      heure,
      status,
      statusLabel,
      action,
      timeLeft,
      participants: r.participants || [],
      est_a_venir: r.statut === 'planifie',
      est_en_direct: r.statut === 'en_cours',
      est_termine: r.statut === 'termine',
      date_debut: debut,
      date_fin: fin,
      places_disponibles: r.max_participants && r.nombre_participants != null
        ? r.max_participants - r.nombre_participants
        : null
    };
  }

  // Filtrage
  setFilter(filter: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'all') {
    this.activeFilter = filter;
    this.applyFilter();
  }

  private applyFilter() {
    this.filteredMeetings = this.activeFilter === 'all'
      ? this.reunions
      : this.reunions.filter(r => r.statut === this.activeFilter);

    this.currentMeeting = this.reunions.find(r => r.statut === 'en_cours') || null;
  }

  // Génération des jours du calendrier avec événements
  private generateCalendarDays() {
    this.calendarDays = Array.from({ length: 30 }, (_, i) => {
      const day = i + 1;
      const hasEvents = this.reunions.some(r => r.date_debut && r.date_debut.getDate() === day);
      return {
        day,
        hasEvents,
        selected: false
      };
    });
  }

  // Récupérer les réunions d’un jour
  getReunionsByDay(day: number): Reunion[] {
    return this.reunions.filter(r => r.date_debut && r.date_debut.getDate() === day);
  }

  // Sélectionner un jour
  selectCalendarDay(dayObj: any) {
    this.calendarDays.forEach(d => d.selected = false);
    dayObj.selected = true;
    this.filteredMeetings = this.getReunionsByDay(dayObj.day);
  }


rejoindre() {
  console.log('rejoindre() appelé');          // 1) est-ce que cela s'affiche ?
  this.router.navigate(['/Etudiant/Reunions/accessMeeting'], { queryParams: { id: this.currentMeeting?.id } })
    .then(result => console.log('navigation result:', result))
    .catch(err => console.error('navigation error:', err));
}


  

}
