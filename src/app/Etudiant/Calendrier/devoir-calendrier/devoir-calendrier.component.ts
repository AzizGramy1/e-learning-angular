import { Component, ViewChild } from '@angular/core';
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
export class DevoirCalendrierComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  // État du modal
  isModalOpen = false;

  // Nouvel événement en cours de création
  newEvent = {
    title: '',
    date: ''
  };

    // 🔹 Variables pour gérer les modals et événements
  selectedDate: string | null = null;
  showModal: boolean = false;


  selectedEvent: { title: string; start: Date | null; end: Date | null } | null = null;
  showEventModal: boolean = false;

  // Options du calendrier
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Aujourd\'hui',
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour'
    },
    events: [
      { title: 'Cours de Math', date: '2025-09-05' },
      { title: 'Examen Physique', date: '2025-09-10' }
    ],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

handleDateClick(arg: DateClickArg) {
  this.selectedDate = arg.dateStr;
  this.showModal = true;
}

handleEventClick(arg: EventClickArg) {
  this.selectedEvent = {
    title: arg.event.title,
    start: arg.event.start,
    end: arg.event.end
  };
  this.showEventModal = true;
}


  /** Ajout d’un événement */
  addEvent() {
    if (this.newEvent.title && this.newEvent.date) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.addEvent({
        title: this.newEvent.title,
        start: this.newEvent.date
      });

      this.closeModal();
    }
  }

  /** Fermer le modal */
  closeModal() {
    this.isModalOpen = false;
    this.newEvent = { title: '', date: '' };
  }
}
