import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';


import { CalendarOptions, FullCalendarModule } from '@fullcalendar/angular';

interface Reminder {
  date: string;
  title: string;
  description: string;
  color: string;
}

interface Calendar {
  date: number;
  isToday: boolean;
  isOtherMonth: boolean;
  reminders?: Reminder[];
  fullDate: Date;
}

interface Event {
  title: string;
  start: string;
  end: string;
  color: string;
  description: string;
  location: string;
}

@Component({
  selector: 'app-devoir-calendrier',
  templateUrl: './devoir-calendrier.component.html',
  styleUrls: ['./devoir-calendrier.component.scss']
})
export class DevoirCalendrierComponent implements OnInit {
  @ViewChild('calendar') calendarRef!: ElementRef;
  calendarOptions: CalendarOptions = {
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
      {
        id: 'event1',
        title: 'JavaScript Avancé',
        start: new Date().toISOString(),
        end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
        color: '#3B82F6',
        description: 'Les promesses et async/await',
        location: 'Salle virtuelle #3'
      },
      {
        id: 'event2',
        title: 'Atelier React',
        start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16, 0, 0).toISOString(),
        color: '#8B5CF6',
        description: 'Gestion d\'état avec Redux',
        location: 'Salle virtuelle #1'
      },
      {
        id: 'event3',
        title: 'Session de mentorat',
        start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
        end: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(17, 30, 0).toISOString(),
        color: '#10B981',
        description: 'Revue de projet personnel',
        location: 'Discussion privée'
      },
      {
        id: 'event4',
        title: 'Quiz JavaScript',
        start: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
        end: new Date(new Date().setDate(new Date().getDate() + 3)).setHours(10, 0, 0).toISOString(),
        color: '#F59E0B',
        description: 'Test sur les concepts avancés',
        location: 'Plateforme EduTech'
      }
    ],
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
    eventContent: (arg) => {
      return {
        html: `<div class="fc-event-main-frame">
          <div class="fc-event-title-container">
            <span class="fc-event-title text-primary">${arg.event.title}</span>
          </div>
          <div class="fc-event-time text-secondary">${arg.timeText}</div>
        </div>`
      };
    },
    eventDidMount: (info) => {
      info.el.style.color = '#FFFFFF'; // Ensure event text is white
      info.el.style.backgroundColor = info.event.backgroundColor;
      info.el.style.borderColor = info.event.backgroundColor;
    },
    dayCellContent: (arg) => {
      return {
        html: `<span class="text-primary">${arg.dayNumberText}</span>`
      };
    },
    eventBackgroundColor: 'transparent', // Allow custom event colors to take precedence
    eventBorderColor: 'transparent',
    dayMaxEvents: true,
    moreLinkContent: (arg) => {
      return {
        html: `<span class="text-primary">+${arg.num} autres</span>`
      };
    }
  };

  showModal = false;
  modalTitle = 'Ajouter un événement';
  isEditing = false;
  currentEvent: Event = {
    title: '',
    start: '',
    end: '',
    color: 'blue',
    description: '',
    location: ''
  };
  events: Event[] = this.calendarOptions.events as Event[];

  ngOnInit(): void {}

  goToToday(): void {
    const calendarApi = this.calendarRef.nativeElement.getApi();
    calendarApi.today();
  }

  openEventModal(event?: any, date?: Date): void {
    if (event) {
      this.isEditing = true;
      this.modalTitle = 'Modifier l\'événement';
      this.currentEvent = {
        id: event.id,
        title: event.title,
        start: this.formatDateTimeForInput(event.start),
        end: event.end ? this.formatDateTimeForInput(event.end) : '',
        color: this.getColorName(event.backgroundColor),
        description: event.extendedProps.description || '',
        location: event.extendedProps.location || ''
      };
    } else {
      this.isEditing = false;
      this.modalTitle = 'Ajouter un événement';
      const startDate = date || new Date();
      this.currentEvent = {
        title: '',
        start: this.formatDateTimeForInput(startDate),
        end: this.formatDateTimeForInput(new Date(startDate.getTime() + 60 * 60 * 1000)),
        color: 'blue',
        description: '',
        location: ''
      };
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveEvent(): void {
    const calendarApi = this.calendarRef.nativeElement.getApi();
    const eventData = {
      id: this.currentEvent.id || this.currentEvent.title + Date.now(),
      title: this.currentEvent.title,
      start: new Date(this.currentEvent.start),
      end: new Date(this.currentEvent.end),
      backgroundColor: this.getHexFromColorName(this.currentEvent.color),
      description: this.currentEvent.description,
      location: this.currentEvent.location
    };

    if (this.isEditing) {
      const event = calendarApi.getEventById(this.currentEvent.id);
      if (event) {
        event.setProp('title', eventData.title);
        event.setDates(eventData.start, eventData.end);
        event.setProp('backgroundColor', eventData.backgroundColor);
        event.setExtendedProp('description', eventData.description);
        event.setExtendedProp('location', eventData.location);
        this.events = this.events.map(e => (e.id === this.currentEvent.id ? eventData : e));
      }
    } else {
      calendarApi.addEvent(eventData);
      this.events.push(eventData);
    }

    this.closeModal();
  }

  deleteEvent(): void {
    if (this.isEditing) {
      const calendarApi = this.calendarRef.nativeElement.getApi();
      const event = calendarApi.getEventById(this.currentEvent.id);
      if (event) {
        event.remove();
        this.events = this.events.filter(e => e.id !== this.currentEvent.id);
      }
      this.closeModal();
    }
  }

  handleEventClick(info: any): void {
    this.openEventModal(info.event);
  }

  handleDateClick(info: any): void {
    this.openEventModal(null, info.date);
  }

  formatDateTimeForInput(date: Date): string {
    return date.toISOString().slice(0, 16);
  }

  getColorName(hex: string): string {
    const colors: { [key: string]: string } = {
      '#3B82F6': 'blue',
      '#EF4444': 'red',
      '#10B981': 'green',
      '#8B5CF6': 'purple',
      '#F59E0B': 'yellow'
    };
    return colors[hex] || 'blue';
  }

  getHexFromColorName(name: string): string {
    const colors: { [key: string]: string } = {
      'blue': '#3B82F6',
      'red': '#EF4444',
      'green': '#10B981',
      'purple': '#8B5CF6',
      'yellow': '#F59E0B'
    };
    return colors[name] || '#3B82F6';
  }

  getEventTimeClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      '#3B82F6': 'bg-blue-600',
      '#8B5CF6': 'bg-purple-600',
      '#10B981': 'bg-green-600',
      '#F59E0B': 'bg-yellow-600',
      '#EF4444': 'bg-red-600'
    };
    return colorMap[color] || 'bg-blue-600';
  }

  getEventDotClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      '#3B82F6': 'bg-blue-500',
      '#8B5CF6': 'bg-purple-500',
      '#10B981': 'bg-green-500',
      '#F59E0B': 'bg-yellow-500',
      '#EF4444': 'bg-red-500'
    };
    return colorMap[color] || 'bg-blue-500';
  }

  formatTime(date: string | Date): string {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}