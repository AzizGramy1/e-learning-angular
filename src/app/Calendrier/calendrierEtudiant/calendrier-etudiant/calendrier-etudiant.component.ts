import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

export type EventType = 'cours' | 'reunion' | 'examen' | 'devoir' | 'live';
export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: EventType;
  course?: string;
  instructor?: string;
  color: string;
  online: boolean;
  joinLink?: string;
  completed: boolean;
}

@Component({
  selector: 'app-calendrier-etudiant',
  templateUrl: './calendrier-etudiant.component.html',
  styleUrls: ['./calendrier-etudiant.component.scss']
})
export class CalendrierEtudiantComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  currentView: CalendarView = 'month';
  selectedDate: Date = new Date();
  showEventModal = false;
  selectedEvent: CalendarEvent | null = null;
  eventTypes = ['tous', 'cours', 'reunion', 'examen', 'devoir', 'live'] as const;
  selectedEventType: 'tous' | EventType = 'tous';
  
  // États de chargement et erreur
  loading = false;
  error: string | null = null;

  // Subjects pour la réactivité
  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
  private filteredEventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
  private destroy$ = new Subject<void>();

  // Observables publics
  events$ = this.eventsSubject.asObservable();
  filteredEvents$ = this.filteredEventsSubject.asObservable();

  // Variables pour les vues semaine et jour
  currentWeek: Date[] = [];
  weekDays: Date[] = [];

  // Données simulées
  private sampleEvents: CalendarEvent[] = [
    {
      id: 1,
      title: 'Angular Avancé - Live Session',
      description: 'Session live sur les performances Angular avec optimisation des bundles',
      start: new Date(new Date().setHours(14, 0, 0, 0)),
      end: new Date(new Date().setHours(16, 0, 0, 0)),
      type: 'live',
      course: 'Angular Masterclass',
      instructor: 'Marie Dubois',
      color: 'from-blue-500 to-cyan-600',
      online: true,
      joinLink: 'https://meet.edutech.com/angular-live',
      completed: false
    },
    {
      id: 2,
      title: 'Révision React Hooks',
      description: 'Révision des concepts avancés des React Hooks',
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
      type: 'cours',
      course: 'React Professional',
      instructor: 'Thomas Martin',
      color: 'from-purple-500 to-pink-600',
      online: true,
      completed: false
    },
    {
      id: 3,
      title: 'Examen Final JavaScript',
      description: 'Examen couvrant tous les concepts JavaScript ES6+',
      start: new Date(new Date().setDate(new Date().getDate() + 2)),
      end: new Date(new Date().setDate(new Date().getDate() + 2)),
      type: 'examen',
      course: 'JavaScript Moderne',
      instructor: 'Sophie Laurent',
      color: 'from-red-500 to-orange-600',
      online: false,
      completed: false
    },
    {
      id: 4,
      title: 'Réunion Mentorat',
      description: 'Session individuelle de mentorat sur votre projet',
      start: new Date(new Date().setDate(new Date().getDate() + 3)),
      end: new Date(new Date().setDate(new Date().getDate() + 3)),
      type: 'reunion',
      course: 'Accompagnement Personnel',
      instructor: 'David Petit',
      color: 'from-green-500 to-emerald-600',
      online: true,
      joinLink: 'https://meet.edutech.com/mentorat',
      completed: false
    },
    {
      id: 5,
      title: 'Devoir à rendre - Projet Final',
      description: 'Date limite pour le rendu du projet final Angular',
      start: new Date(new Date().setDate(new Date().getDate() + 5)),
      end: new Date(new Date().setDate(new Date().getDate() + 5)),
      type: 'devoir',
      course: 'Angular Masterclass',
      instructor: 'Marie Dubois',
      color: 'from-yellow-500 to-amber-600',
      online: false,
      completed: false
    },
    {
      id: 6,
      title: 'Workshop UI/UX Design',
      description: 'Atelier pratique sur les principes de design moderne',
      start: new Date(new Date().setDate(new Date().getDate() + 7)),
      end: new Date(new Date().setDate(new Date().getDate() + 7)),
      type: 'cours',
      course: 'UI/UX Design',
      instructor: 'Laura Blanc',
      color: 'from-indigo-500 to-purple-600',
      online: true,
      completed: false
    }
  ];

  daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
    this.setupSubscriptions();
    this.generateWeekDays();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions(): void {
    this.events$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateFilteredEvents());
  }

  async loadEvents(): Promise<void> {
    this.loading = true;
    this.error = null;
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!this.validateEvents(this.sampleEvents)) {
        throw new Error('Données d\'événements invalides');
      }
      
      this.eventsSubject.next(this.sampleEvents);
    } catch (error) {
      this.error = 'Erreur lors du chargement des événements';
      console.error('Error loading events:', error);
    } finally {
      this.loading = false;
    }
  }

  private validateEvents(events: any[]): events is CalendarEvent[] {
    return events.every(event => 
      event &&
      typeof event.id === 'number' &&
      typeof event.title === 'string' &&
      event.start instanceof Date &&
      event.end instanceof Date &&
      ['cours', 'reunion', 'examen', 'devoir', 'live'].includes(event.type)
    );
  }

  private updateFilteredEvents(): void {
    const events = this.eventsSubject.value;
    const filtered = this.selectedEventType === 'tous' 
      ? events 
      : events.filter(event => event.type === this.selectedEventType);
    this.filteredEventsSubject.next(filtered);
  }

  // Navigation du calendrier
  previousPeriod(): void {
    switch (this.currentView) {
      case 'month':
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        break;
      case 'week':
        this.currentDate = new Date(this.currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.generateWeekDays();
        break;
      case 'day':
        this.currentDate = new Date(this.currentDate.getTime() - 24 * 60 * 60 * 1000);
        break;
    }
  }

  nextPeriod(): void {
    switch (this.currentView) {
      case 'month':
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        break;
      case 'week':
        this.currentDate = new Date(this.currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        this.generateWeekDays();
        break;
      case 'day':
        this.currentDate = new Date(this.currentDate.getTime() + 24 * 60 * 60 * 1000);
        break;
    }
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    if (this.currentView === 'week') {
      this.generateWeekDays();
    }
  }

  setView(view: CalendarView): void {
    this.currentView = view;
    if (view === 'week') {
      this.generateWeekDays();
    }
  }

  // Génération des jours pour la vue semaine
  private generateWeekDays(): void {
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    this.weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.weekDays.push(date);
    }
  }

  private getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajuster pour lundi comme premier jour
    return new Date(date.setDate(diff));
  }

  // Gestion des événements
  getEventsForDate(date: Date): CalendarEvent[] {
    return this.filteredEventsSubject.value.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  }

  getEventsForDateRange(startDate: Date, endDate: Date): CalendarEvent[] {
    return this.filteredEventsSubject.value.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  getEventsForToday(): CalendarEvent[] {
    const today = new Date();
    return this.filteredEventsSubject.value.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === today.toDateString();
    });
  }

  getUpcomingEvents(): CalendarEvent[] {
    const now = new Date();
    return this.filteredEventsSubject.value
      .filter(event => new Date(event.start) > now && !event.completed)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5);
  }

  selectEvent(event: CalendarEvent): void {
    this.selectedEvent = event;
    this.showEventModal = true;
  }

  closeEventModal(): void {
    this.showEventModal = false;
    this.selectedEvent = null;
  }

  joinEvent(event: CalendarEvent): void {
    if (event.joinLink) {
      window.open(event.joinLink, '_blank');
    }
  }

  markAsCompleted(event: CalendarEvent): void {
    const updatedEvents = this.eventsSubject.value.map(e => 
      e.id === event.id ? { ...e, completed: true } : e
    );
    this.eventsSubject.next(updatedEvents);
    this.closeEventModal();
  }

  // Nouvel événement
  createNewEventForToday(): void {
    this.showNewEventModal(new Date());
  }

  showNewEventModal(date: Date): void {
    this.selectedDate = date;
    this.createNewEvent(date);
  }

  createNewEvent(date: Date): void {
    const newEvent: CalendarEvent = {
      id: Math.max(0, ...this.eventsSubject.value.map(e => e.id)) + 1,
      title: 'Nouvel événement',
      description: 'Description de votre nouvel événement',
      start: new Date(date),
      end: new Date(date.getTime() + 60 * 60 * 1000), // +1 heure
      type: 'cours',
      course: 'Nouveau cours',
      instructor: 'Votre instructeur',
      color: this.getEventTypeColor('cours'),
      online: false,
      completed: false
    };
    
    const updatedEvents = [...this.eventsSubject.value, newEvent];
    this.eventsSubject.next(updatedEvents);
    this.selectEvent(newEvent);
  }

  // Utilitaires pour le calendrier
  getDaysInMonth(): Date[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    
    // Ajouter les jours du mois précédent pour compléter la première semaine
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = startingDayOfWeek; i > 0; i--) {
      days.push(new Date(year, month, -i + 1));
    }
    
    // Ajouter les jours du mois courant
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Ajouter les jours du mois suivant pour compléter la dernière semaine
    const totalCells = 42; // 6 semaines
    const remainingDays = totalCells - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isSelected(date: Date): boolean {
    return this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth() && 
           date.getFullYear() === this.currentDate.getFullYear();
  }

  // Méthodes trackBy pour l'optimisation
  trackByDate(index: number, item: Date): number {
    return item.getTime();
  }

  trackByEvent(index: number, item: CalendarEvent): number {
    return item.id;
  }

  trackByEventType(index: number, item: string): string {
    return item;
  }

  // Utilitaires d'affichage
  getEventTypeIcon(type: EventType): string {
    switch (type) {
      case 'cours': return 'fas fa-play-circle';
      case 'reunion': return 'fas fa-users';
      case 'examen': return 'fas fa-file-alt';
      case 'devoir': return 'fas fa-tasks';
      case 'live': return 'fas fa-video';
      default: return 'fas fa-calendar';
    }
  }

  getEventTypeColor(type: EventType): string {
    switch (type) {
      case 'cours': return 'from-blue-500 to-cyan-600';
      case 'reunion': return 'from-green-500 to-emerald-600';
      case 'examen': return 'from-red-500 to-orange-600';
      case 'devoir': return 'from-yellow-500 to-amber-600';
      case 'live': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  }

  getEventColor(type: EventType): string {
    switch (type) {
      case 'cours': return '#3b82f6';
      case 'reunion': return '#10b981';
      case 'examen': return '#ef4444';
      case 'devoir': return '#f59e0b';
      case 'live': return '#8b5cf6';
      default: return '#6b7280';
    }
  }

  getEventTextColor(type: EventType): string {
    switch (type) {
      case 'cours': return 'blue-400';
      case 'reunion': return 'green-400';
      case 'examen': return 'red-400';
      case 'devoir': return 'yellow-400';
      case 'live': return 'purple-400';
      default: return 'gray-400';
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatShortDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }

  onEventTypeChange(): void {
    this.updateFilteredEvents();
  }
}