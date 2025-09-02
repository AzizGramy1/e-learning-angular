import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Devoir } from 'src/app/Models/Devoir';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { DevoirService } from 'src/app/Service/Devoir/devoir.service';

@Component({
  selector: 'app-liste-des-devoir-avenir',
  templateUrl: './liste-des-devoir-avenir.component.html',
  styleUrls: ['./liste-des-devoir-avenir.component.scss']
})
export class ListeDesDevoirAvenirComponent {

 todayDate: string = new Date().toLocaleDateString();
  calendarDays: { number: number, hasAssignment: boolean, isToday: boolean, isSelected: boolean }[] = [];
  assignments: any[] = [];
  completedAssignments: any[] = [];
  sidebarVisible = false;

  constructor(
    private devoirService: DevoirService,
    private authService: AuthentificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initCalendarDays();
    this.loadDevoirs();
  }

  initCalendarDays() {
    // Initialisation simple des jours pour le calendrier (exemple statique)
    for (let i = 1; i <= 31; i++) {
      this.calendarDays.push({
        number: i,
        hasAssignment: false,
        isToday: i === new Date().getDate(),
        isSelected: i === new Date().getDate()
      });
    }
  }

  loadDevoirs() {
    const etudiant = this.authService.getUser();
    if (!etudiant || !etudiant.id) return;

    this.devoirService.devoirsAVenirNonRendus(etudiant.id).subscribe({
      next: (devoirs: Devoir[]) => {
        this.assignments = devoirs.map(d => ({
          id: d.id,  // ✅ indispensable pour voir details
          title: d.titre,
          description: d.description,
          status: this.computeStatus(d),
          dueDate: new Date(d.date_limite).toLocaleString(),
          points: d.points,
          submissionType: d.type_remise,
          deadlineStatus: this.computeDeadlineStatus(d),
          deadlineIcon: this.computeDeadlineIcon(d),
          countdown: this.computeCountdown(d.date_limite)
        }));

        // Marquer les jours du calendrier ayant un devoir
        this.assignments.forEach(a => {
          const dayNum = new Date(a.dueDate).getDate();
          const day = this.calendarDays.find(d => d.number === dayNum);
          if (day) day.hasAssignment = true;
        });
      },
      error: (err) => console.error('Erreur chargement devoirs:', err)
    });
  }

  computeStatus(devoir: Devoir): string {
    // Exemple simplifié, peut être amélioré selon le backend
    const now = new Date();
    const due = new Date(devoir.date_limite);
    return due < now ? 'Terminé' : 'À faire';
  }

  computeDeadlineStatus(devoir: Devoir): string {
    const now = new Date();
    const due = new Date(devoir.date_limite);
    const diff = due.getTime() - now.getTime();
    if (diff < 24 * 60 * 60 * 1000) return 'urgent';
    if (diff < 3 * 24 * 60 * 60 * 1000) return 'warning';
    return 'normal';
  }

  computeDeadlineIcon(devoir: Devoir): string {
    const status = this.computeDeadlineStatus(devoir);
    if (status === 'urgent') return 'exclamation-circle';
    return 'clock';
  }

  computeCountdown(dateLimite: string): string {
    const now = new Date();
    const due = new Date(dateLimite);
    const diffMs = due.getTime() - now.getTime();
    if (diffMs <= 0) return 'Dépassé';
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
    return `${diffDays}j ${diffHours}h ${diffMinutes}m restantes`;
  }

  selectDay(day: { number: number, hasAssignment: boolean, isToday: boolean, isSelected: boolean }) {
    this.calendarDays.forEach(d => d.isSelected = false);
    day.isSelected = true;
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    const sidebar = document.querySelector('.sidebar-bg');
    if (sidebar) sidebar.classList.toggle('hidden', !this.sidebarVisible);
  }

  voirDetails(assignment: any) {
  this.router.navigate(['/devoirs', assignment.id, 'details']);
}
}


