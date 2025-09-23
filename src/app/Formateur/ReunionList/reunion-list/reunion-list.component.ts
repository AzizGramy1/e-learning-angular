import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reunion-list',
  templateUrl: './reunion-list.component.html',
  styleUrls: ['./reunion-list.component.scss']
})
export class ReunionListComponent implements OnInit {
  todayMeetings = [
    {
      id: 1,
      title: 'JavaScript Avancé - Promesses',
      description: 'Session sur les promesses et async/await',
      date: 'Aujourd\'hui',
      time: '14:30 - 16:00',
      duration: 90,
      room: '101',
      participants: 24,
      isStartingSoon: true,
      documents: 3
    },
    {
      id: 2,
      title: 'React Hooks Avancés',
      description: 'Utilisation des hooks personnalisés',
      date: 'Aujourd\'hui',
      time: '18:00 - 19:30',
      duration: 90,
      room: '102',
      participants: 18,
      isStartingSoon: false,
      documents: 5
    }
  ];

  futureMeetings = [
    {
      id: 3,
      title: 'Python Data Science',
      description: 'Introduction à Pandas et NumPy',
      date: 'Demain',
      time: '10:00 - 12:00',
      duration: 120,
      room: '103',
      participants: 32,
      isStartingSoon: false,
      documents: 2
    },
    {
      id: 4,
      title: 'Architecture Logicielle',
      description: 'Design Patterns et bonnes pratiques',
      date: '25/01/2024',
      time: '14:00 - 16:30',
      duration: 150,
      room: '104',
      participants: 22,
      isStartingSoon: false,
      documents: 4
    },
    {
      id: 5,
      title: 'Développement Web Moderne',
      description: 'HTML5, CSS3 et JavaScript ES6+',
      date: '28/01/2024',
      time: '09:00 - 11:00',
      duration: 120,
      room: '105',
      participants: 45,
      isStartingSoon: false,
      documents: 6
    }
  ];

  upcomingMeetings = [...this.todayMeetings, ...this.futureMeetings];
  selectedMeeting = this.todayMeetings[0];

  ngOnInit() {
    this.setupCardAnimations();
  }

  setupCardAnimations() {
    // Mêmes animations que les interfaces précédentes
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('animate__animated', 'animate__pulse');
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('animate__animated', 'animate__pulse');
      });
    });
  }

  getMeetingBorderClass(meeting: any): string {
    if (meeting.isStartingSoon) {
      return 'border-orange-500';
    } else if (meeting.date === 'Aujourd\'hui') {
      return 'border-blue-500';
    } else {
      return 'border-purple-500';
    }
  }

  selectMeeting(meeting: any) {
    this.selectedMeeting = meeting;
  }

  toggleUserMenu() {
    console.log('User menu toggled');
  }

  toggleMobileMenu() {
    console.log('Mobile menu toggled');
  }
}