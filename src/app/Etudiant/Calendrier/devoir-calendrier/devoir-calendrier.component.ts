import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';



@Component({
  selector: 'app-devoir-calendrier',
  templateUrl: './devoir-calendrier.component.html',
  styleUrls: ['./devoir-calendrier.component.scss']
})
export class DevoirCalendrierComponent  implements OnInit {
  currentDate: Date = new Date();
  currentMonth!: number;
  currentYear!: number;
  daysInMonth: number[] = [];
  firstDayOfMonth!: number;
  monthNames: string[] = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
  ];
  dayNames: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  
  // Événements et rappels
  reminders: any[] = [
    { date: new Date(2023, 8, 15), title: 'Examen JavaScript', type: 'exam' },
    { date: new Date(2023, 8, 18), title: 'Projet à rendre', type: 'assignment' },
    { date: new Date(2023, 8, 20), title: 'Live avec mentor', type: 'live' }
  ];
  
  // Variables pour le formulaire
  showReminderForm: boolean = false;
  selectedDate: Date = new Date();
  newReminder: any = {
    title: '',
    description: '',
    time: '12:00',
    type: 'general'
  };

  constructor() { }

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    
    // Premier jour du mois
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    this.firstDayOfMonth = firstDay.getDay();
    // Ajustement pour commencer par lundi (0 = dimanche, 1 = lundi, etc.)
    this.firstDayOfMonth = this.firstDayOfMonth === 0 ? 6 : this.firstDayOfMonth - 1;
    
    // Nombre de jours dans le mois
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    
    // Générer les jours du mois
    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  getRemindersForDay(day: number): any[] {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return this.reminders.filter(reminder => 
      reminder.date.getDate() === date.getDate() &&
      reminder.date.getMonth() === date.getMonth() &&
      reminder.date.getFullYear() === date.getFullYear()
    );
  }

  prevMonth(): void {
    this.currentDate = new Date(this.currentYear, this.currentMonth - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentYear, this.currentMonth + 1, 1);
    this.generateCalendar();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.generateCalendar();
  }

  isToday(day: number): boolean {
    const today = new Date();
    return day === today.getDate() && 
           this.currentMonth === today.getMonth() && 
           this.currentYear === today.getFullYear();
  }

  openReminderForm(day: number): void {
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
    this.newReminder = {
      title: '',
      description: '',
      time: '12:00',
      type: 'general'
    };
    this.showReminderForm = true;
  }

  addReminder(): void {
    if (this.newReminder.title.trim() === '') return;
    
    const reminderDate = new Date(this.selectedDate);
    const [hours, minutes] = this.newReminder.time.split(':');
    reminderDate.setHours(parseInt(hours), parseInt(minutes));
    
    this.reminders.push({
      date: reminderDate,
      title: this.newReminder.title,
      description: this.newReminder.description,
      type: this.newReminder.type
    });
    
    this.showReminderForm = false;
  }

  closeReminderForm(): void {
    this.showReminderForm = false;
  }

  getReminderClass(type: string): string {
    switch(type) {
      case 'exam': return 'bg-red-500 bg-opacity-20 text-red-400';
      case 'assignment': return 'bg-blue-500 bg-opacity-20 text-blue-400';
      case 'live': return 'bg-green-500 bg-opacity-20 text-green-400';
      case 'quiz': return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      case 'general': return 'bg-gray-500 bg-opacity-20 text-gray-400';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  }

  getReminderIcon(type: string): string {
    switch(type) {
      case 'exam': return 'fas fa-file-alt';
      case 'assignment': return 'fas fa-tasks';
      case 'live': return 'fas fa-video';
      case 'quiz': return 'fas fa-question-circle';
      case 'general': return 'fas fa-bell';
      default: return 'fas fa-bell';
    }
  }

  // Utilitaire pour créer un tableau de longueur n
  arrayFromNumber(n: number): any[] {
    return Array.from({length: n}, (_, i) => i);
  }
}