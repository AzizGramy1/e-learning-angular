import { Component, OnInit } from '@angular/core';
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
  calendarDays: number[] = [];

  constructor(private reunionService: ReunionService) { }

  ngOnInit(): void {
    this.reunionService.getMesReunions().subscribe(reunions => {
      // Mapping pour adapter les champs
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
  private mapReunion(r: Reunion): Reunion {
    return {
      ...r,
      est_a_venir: r.statut === 'planifie',
      est_en_direct: r.statut === 'en_cours',
      est_termine: r.statut === 'termine',
      date_debut: r.date_debut ? new Date(r.date_debut) : undefined,
      date_fin: r.date_fin ? new Date(r.date_fin) : undefined,
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

  // Génération des jours du calendrier (exemple simple : 1 à 30)
  private generateCalendarDays() {
    this.calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  }
}
